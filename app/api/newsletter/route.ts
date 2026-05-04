import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/import/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: parsed.data.email, name: parsed.data.name, is_active: true },
        { onConflict: "email", ignoreDuplicates: false }
      );

    if (error) {
      return NextResponse.json({ error: "Error al suscribir" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
