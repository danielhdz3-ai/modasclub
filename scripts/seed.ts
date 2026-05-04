/**
 * Seed script — datos de prueba para ModasClub
 * Uso: npx ts-node --project tsconfig.json scripts/seed.ts
 * O bien: npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seed() {
  console.log("🌱 Iniciando seed de ModasClub...\n");

  // ── Supplier ──────────────────────────────────────────────
  console.log("📦 Creando proveedor de prueba...");
  const { data: supplier } = await supabase
    .from("suppliers")
    .upsert({ name: "Proveedor Demo", website: "https://ejemplo.com", is_active: true }, { onConflict: "name" })
    .select()
    .single();
  console.log("   ✓", supplier?.name);

  // ── Categories ────────────────────────────────────────────
  console.log("🗂  Verificando categorías...");
  const categoryData = [
    { name: "Bolsos", slug: "bolsos", sort_order: 1,
      image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
    { name: "Perfumes", slug: "perfumes", sort_order: 2,
      image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80" },
    { name: "Relojes", slug: "relojes", sort_order: 3,
      image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80" },
  ];
  const { data: categories } = await supabase
    .from("categories")
    .upsert(categoryData, { onConflict: "slug" })
    .select();
  categories?.forEach((c) => console.log("   ✓", c.name));

  const catMap = Object.fromEntries(categories?.map((c) => [c.slug, c.id]) ?? []);

  // ── Products ──────────────────────────────────────────────
  console.log("\n🛍  Creando productos de prueba...");

  const products = [
    {
      name: "Bolso Tote Milano Nude",
      slug: "bolso-tote-milano-nude",
      description: "Un bolso tote de líneas limpias en tono nude, confeccionado en piel sintética de alta calidad. Amplio interior con bolsillos organizadores. El compañero perfecto para el día a día.",
      brand: "Milano",
      cost_price: 18.00,
      price: 39.99,
      member_price: 34.99,
      compare_at_price: 54.99,
      stock_quantity: 25,
      stock_status: "in_stock",
      gender: "women",
      category_id: catMap["bolsos"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      is_active: true,
      is_featured: true,
      tags: ["bolso", "tote", "nude", "piel"],
      supplier_sku: "MLN-001",
    },
    {
      name: "Bolso Clutch Fiesta Dorado",
      slug: "bolso-clutch-fiesta-dorado",
      description: "Clutch de noche en tono dorado con cierre magnético y cadena desmontable. Perfecto para eventos especiales y cenas de gala.",
      brand: "Glam",
      cost_price: 12.00,
      price: 29.99,
      member_price: 25.99,
      compare_at_price: 39.99,
      stock_quantity: 15,
      stock_status: "low_stock",
      gender: "women",
      category_id: catMap["bolsos"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      is_active: true,
      is_featured: true,
      tags: ["clutch", "fiesta", "dorado", "noche"],
      supplier_sku: "GLM-002",
    },
    {
      name: "Perfume Rose Élégante 50ml",
      slug: "perfume-rose-elegante-50ml",
      description: "Una fragancia floral envolvente con notas de rosa turca, jazmín y almizcle suave. Eau de Parfum de larga duración que deja una estela inconfundible.",
      brand: "Élégante",
      cost_price: 15.00,
      price: 34.99,
      member_price: 29.99,
      compare_at_price: 49.99,
      stock_quantity: 30,
      stock_status: "in_stock",
      gender: "women",
      category_id: catMap["perfumes"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
      is_active: true,
      is_featured: true,
      tags: ["perfume", "rosa", "floral", "edp"],
      supplier_sku: "ELG-003",
    },
    {
      name: "Perfume Noir Intense 100ml",
      slug: "perfume-noir-intense-100ml",
      description: "Fragancia oriental profunda con notas de ámbar negro, cedro y vainilla. Ideal para las noches más especiales. Projection potente y larga duración.",
      brand: "Noir Paris",
      cost_price: 22.00,
      price: 49.99,
      member_price: 44.99,
      stock_quantity: 20,
      stock_status: "in_stock",
      gender: "unisex",
      category_id: catMap["perfumes"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80",
      is_active: true,
      is_featured: false,
      tags: ["perfume", "noir", "ambar", "oriental"],
      supplier_sku: "NRP-004",
    },
    {
      name: "Reloj Minimalista Rose Gold",
      slug: "reloj-minimalista-rose-gold",
      description: "Elegancia en su máxima expresión. Caja de 36mm en acero rose gold, esfera blanca con índices dorados y correa de cuero genuino. Movimiento de cuarzo japonés.",
      brand: "Tempo",
      cost_price: 28.00,
      price: 64.99,
      member_price: 56.99,
      compare_at_price: 89.99,
      stock_quantity: 10,
      stock_status: "low_stock",
      gender: "women",
      category_id: catMap["relojes"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
      is_active: true,
      is_featured: true,
      tags: ["reloj", "rose gold", "minimalista", "cuero"],
      supplier_sku: "TMP-005",
    },
    {
      name: "Reloj Clásico Negro Acero",
      slug: "reloj-clasico-negro-acero",
      description: "Reloj con caja de 40mm en acero inoxidable cepillado. Esfera negra con manecillas luminosas y cristal mineral. Resistente al agua hasta 30m.",
      brand: "Tempo",
      cost_price: 32.00,
      price: 74.99,
      member_price: 64.99,
      stock_quantity: 8,
      stock_status: "in_stock",
      gender: "unisex",
      category_id: catMap["relojes"],
      supplier_id: supplier?.id,
      primary_image_url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80",
      is_active: true,
      is_featured: false,
      tags: ["reloj", "negro", "acero", "clasico"],
      supplier_sku: "TMP-006",
    },
  ];

  for (const product of products) {
    const { data, error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "slug" })
      .select()
      .single();
    if (error) {
      console.log("   ✗", product.name, "→", error.message);
    } else {
      console.log("   ✓", data.name);
    }
  }

  // ── Newsletter subscribers ────────────────────────────────
  console.log("\n📧 Creando suscriptoras de prueba...");
  const subs = [
    { email: "laura@ejemplo.com", name: "Laura García" },
    { email: "sofia@ejemplo.com", name: "Sofía Martínez" },
    { email: "carmen@ejemplo.com", name: "Carmen Ruiz" },
  ];
  for (const sub of subs) {
    await supabase
      .from("newsletter_subscribers")
      .upsert(sub, { onConflict: "email", ignoreDuplicates: true });
    console.log("   ✓", sub.email);
  }

  console.log("\n✅ Seed completado correctamente.");
  console.log("   Visita http://localhost:3000 para ver la tienda.");
  console.log("   Panel admin en http://localhost:3000/admin");
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
