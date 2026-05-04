import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json() as {
      name?: string;
      brand?: string;
      category?: string;
      attributes?: Record<string, unknown>;
      existing_description?: string;
    };

    const { name, brand, category, attributes, existing_description } = body;

    if (!name) {
      return NextResponse.json({ error: "Nombre del producto requerido" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API de IA no configurada" }, { status: 503 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = [
      `Producto: ${name}`,
      brand ? `Marca: ${brand}` : null,
      category ? `Categoría: ${category}` : null,
      attributes ? `Atributos: ${JSON.stringify(attributes)}` : null,
      existing_description ? `Descripción original: ${existing_description}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: `Eres un copywriter experto en moda y lujo para la tienda ModasClub.
Escribes descripciones de producto elegantes, evocadoras y que convierten.
El tono es sofisticado pero accesible. Siempre en español.
Destacas: materiales, diseño, ocasiones de uso, y exclusividad.
Máximo 150 palabras. Sin bullet points. Prosa fluida y seductora.
Responde SOLO con la descripción, sin encabezados ni explicaciones.`,
      messages: [{ role: "user", content: prompt }],
    });

    const description = message.content[0]?.type === "text" ? message.content[0].text : null;

    return NextResponse.json({ description });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al generar descripción" },
      { status: 500 }
    );
  }
}
