import Link from "next/link";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(id,name,slug)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);
    return (data as Product[]) ?? [];
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

        <ProductGrid products={products} columns={4} />

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
