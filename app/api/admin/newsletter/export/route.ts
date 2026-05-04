import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: subscribers } = await admin
    .from("newsletter_subscribers")
    .select("email, name, is_active, subscribed_at")
    .order("subscribed_at", { ascending: false });

  if (!subscribers) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }

  const header = "email,nombre,activa,fecha_suscripcion\n";
  const rows = subscribers
    .map((s) =>
      [
        s.email,
        s.name ?? "",
        s.is_active ? "si" : "no",
        new Date(s.subscribed_at).toLocaleDateString("es-ES"),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
