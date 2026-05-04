import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: suppliers }] = await Promise.all([
    supabase.from("categories").select("id, name").eq("is_active", true).order("name"),
    supabase.from("suppliers").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
          Nuevo producto
        </h1>
        <p className="text-[13px] text-text-muted font-light">
          Los productos se crean inactivos y deben activarse manualmente.
        </p>
      </div>

      <ProductForm
        mode="create"
        categories={categories ?? []}
        suppliers={suppliers ?? []}
      />
    </div>
  );
}
