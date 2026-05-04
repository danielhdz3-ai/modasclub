import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("id, name, slug, price, stock_status, is_active, is_featured, brand, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params.search) query = query.ilike("name", `%${params.search}%`);
  if (params.status === "active") query = query.eq("is_active", true);
  if (params.status === "inactive") query = query.eq("is_active", false);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text">
            Productos
          </h1>
          <p className="text-[13px] text-text-muted mt-1">{count ?? 0} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-[13px]"
        >
          <Plus size={14} strokeWidth={2} />
          Nuevo producto
        </Link>
      </div>

      {/* Filters */}
      <form className="flex gap-3 mb-5">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Buscar por nombre..."
          className="input-base text-[13px] py-2 px-3 flex-1 max-w-xs"
        />
        <select name="status" defaultValue={params.status} className="input-base text-[13px] py-2 px-3">
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <button type="submit" className="btn-outline text-[13px] px-4 py-2">Filtrar</button>
      </form>

      <div className="bg-white rounded-card border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Marca</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Precio</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-light text-text truncate max-w-[220px]">{p.name}</p>
                    {p.is_featured && (
                      <span className="text-[10px] text-gold uppercase tracking-wider">★ Destacado</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary font-light">{p.brand ?? "—"}</td>
                <td className="px-4 py-3 font-light text-text">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] uppercase tracking-wider font-medium ${
                    p.stock_status === "in_stock" ? "text-success" :
                    p.stock_status === "out_of_stock" ? "text-error" : "text-gold"
                  }`}>
                    {p.stock_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    p.is_active ? "bg-success/10 text-success" : "bg-error/10 text-error"
                  }`}>
                    {p.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="text-primary hover:text-primary-hover text-[12px] transition-colors"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-text-muted text-[13px] font-light">
            No se encontraron productos.{" "}
            <Link href="/admin/proveedores" className="text-primary">Importar catálogo</Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-5 justify-end">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/admin/productos?page=${i + 1}${params.search ? `&search=${params.search}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center rounded text-[12px] transition-all ${
                page === i + 1 ? "bg-primary text-white" : "bg-white border border-border text-text-secondary hover:border-primary"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
