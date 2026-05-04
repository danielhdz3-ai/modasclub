import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/store/ProductGrid";
import { buildMetadata } from "@/lib/utils/seo";
import type { Product, Category } from "@/types/database";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return { category: category as Category, products: (products as Product[]) ?? [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryData(slug);
  if (!result) return {};

  return buildMetadata({
    title: `${result.category.name} | ModasClub`,
    description: result.category.meta_description ?? result.category.description ?? undefined,
    canonical: `/categoria/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const result = await getCategoryData(slug);
  if (!result) notFound();

  const { category, products } = result;

  return (
    <div className="section-padding">
      <div className="content-max">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-3">Categoría</p>
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-5xl text-text font-light">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 text-[14px] text-text-secondary font-light max-w-lg mx-auto">
              {category.description}
            </p>
          )}
        </div>

        <ProductGrid products={products} columns={3} />
      </div>
    </div>
  );
}
