import Link from "next/link";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data: featured } = await supabase
      .from("products")
      .select("*, category:categories(id,name,slug)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    const list = (featured as Product[]) ?? [];
    if (list.length > 0) return list;

    const { data: fallback } = await supabase
      .from("products")
      .select("*, category:categories(id,name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8);
    return (fallback as Product[]) ?? [];
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="section-padding bg-surface">
      <div className="content-max">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-3">Selección</p>
          <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl md:text-5xl text-text font-light">
            Piezas destacadas
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
            <p className="font-[family-name:var(--font-cormorant)] italic text-2xl text-text-muted mb-2">
              Aún no hay productos para mostrar
            </p>
            <p className="text-[13px] text-text-muted font-light mb-6">
              Comprueba que Supabase tenga datos y que las variables de entorno en Vercel coincidan con tu
              proyecto. También puedes ejecutar <code className="text-xs bg-surface-2 px-1 rounded">npm run seed</code> en local.
            </p>
            <Link href="/productos" className="btn-primary">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} columns={4} />
        )}

        <div className="flex justify-center mt-12">
          <Link href="/productos">
            <Button variant="outline" size="lg">
              Ver toda la colección
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
