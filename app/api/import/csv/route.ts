import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseFile, applyMapping } from "@/lib/import/csv-parser";
import { normalizeProductRows } from "@/lib/import/normalizer";
import type { ColumnMapping } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const supplierId = formData.get("supplier_id") as string | null;
    const mappingRaw = formData.get("mapping") as string | null;
    const preview = formData.get("preview") === "true";

    if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    if (!supplierId) return NextResponse.json({ error: "Proveedor requerido" }, { status: 400 });

    const rows = await parseFile(file);

    if (preview) {
      // Return first 50 rows + column names for the mapping UI
      return NextResponse.json({
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        preview: rows.slice(0, 50),
        total: rows.length,
      });
    }

    if (!mappingRaw) return NextResponse.json({ error: "Mapeo de columnas requerido" }, { status: 400 });

    const mapping: ColumnMapping = JSON.parse(mappingRaw) as ColumnMapping;
    const mappedRows = applyMapping(rows, mapping);
    const { products, result } = normalizeProductRows(mappedRows, { supplierId });

    const adminClient = createAdminClient();
    let created = 0;
    let updated = 0;

    // Log import start
    const { data: importLog } = await adminClient
      .from("supplier_imports")
      .insert({
        supplier_id: supplierId,
        filename: file.name,
        total_rows: result.total,
        status: "processing",
        started_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    for (const product of products) {
      // Check if product with this supplier_sku already exists
      const { data: existing } = await adminClient
        .from("products")
        .select("id")
        .eq("supplier_id", supplierId)
        .eq("supplier_sku", product.supplier_sku ?? "")
        .single();

      if (existing) {
        const { error } = await adminClient
          .from("products")
          .update({
            ...product,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (!error) updated++;
      } else {
        const { error } = await adminClient
          .from("products")
          .insert(product);
        if (!error) created++;
      }
    }

    // Update import log
    if (importLog) {
      await adminClient
        .from("supplier_imports")
        .update({
          imported_rows: created,
          updated_rows: updated,
          error_rows: result.errors.length,
          errors: result.errors,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", importLog.id);
    }

    return NextResponse.json({
      success: true,
      result: { ...result, created, updated },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}
