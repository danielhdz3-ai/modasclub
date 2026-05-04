import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: suppliers }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single(),
      supabase.from("categories").select("id, name").eq("is_active", true).order("name"),
      supabase.from("suppliers").select("id, name").eq("is_active", true).order("name"),
    ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
          Editar producto
        </h1>
        <p className="text-[13px] text-text-muted font-light truncate max-w-xl">
          {product.name}
        </p>
      </div>

      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          brand: product.brand ?? "",
          supplier_sku: product.supplier_sku ?? "",
          cost_price: product.cost_price?.toString() ?? "",
          price: product.price?.toString() ?? "",
          member_price: product.member_price?.toString() ?? "",
          compare_at_price: product.compare_at_price?.toString() ?? "",
          stock_quantity: product.stock_quantity?.toString() ?? "0",
          stock_status: product.stock_status ?? "in_stock",
          gender: product.gender ?? "women",
          category_id: product.category_id ?? "",
          supplier_id: product.supplier_id ?? "",
          primary_image_url: product.primary_image_url ?? "",
          is_active: product.is_active ?? false,
          is_featured: product.is_featured ?? false,
          tags: (product.tags as string[] | null)?.join(", ") ?? "",
        }}
        categories={categories ?? []}
        suppliers={suppliers ?? []}
      />
    </div>
  );
}
