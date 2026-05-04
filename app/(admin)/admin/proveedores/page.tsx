import { createClient } from "@/lib/supabase/server";
import { CsvImporter } from "@/components/admin/CsvImporter";

export default async function ProveedoresPage() {
  const supabase = await createClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
            Proveedores
          </h1>
          <p className="text-[13px] text-text-muted font-light">
            Importa catálogos de tus proveedores en CSV o Excel
          </p>
        </div>
      </div>

      {suppliers && suppliers.length > 0 ? (
        <div className="space-y-8">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-card border border-border p-6">
              <h2 className="font-medium text-[15px] mb-5 pb-4 border-b border-border">
                Importar para: <span className="text-primary">{supplier.name}</span>
              </h2>
              <CsvImporter supplierId={supplier.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-card border border-border p-12 text-center">
          <p className="text-[14px] text-text-muted font-light">
            No hay proveedores activos. Crea uno primero en la tabla <code>suppliers</code> de Supabase.
          </p>
        </div>
      )}
    </div>
  );
}
