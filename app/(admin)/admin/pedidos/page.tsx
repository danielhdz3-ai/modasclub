import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { ORDER_STATUS_LABELS } from "@/lib/utils/constants";

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, status, total, payment_status, created_at, user_id",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params.status) query = query.eq("status", params.status);

  const { data: orders, count } = await query;

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-gold/10 text-gold",
    confirmed: "bg-blue-50 text-blue-600",
    processing: "bg-purple-50 text-purple-600",
    shipped: "bg-sky-50 text-sky-600",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-error/10 text-error",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
          Pedidos
        </h1>
        <p className="text-[13px] text-text-muted">{count ?? 0} pedidos en total</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { label: "Todos", value: "" },
          { label: "Pendientes", value: "pending" },
          { label: "Confirmados", value: "confirmed" },
          { label: "En proceso", value: "processing" },
          { label: "Enviados", value: "shipped" },
          { label: "Entregados", value: "delivered" },
          { label: "Cancelados", value: "cancelled" },
        ].map((opt) => (
          <a
            key={opt.value}
            href={`/admin/pedidos${opt.value ? `?status=${opt.value}` : ""}`}
            className={`px-3 py-1.5 rounded-pill text-[12px] transition-all border ${
              (params.status ?? "") === opt.value
                ? "bg-primary text-white border-primary"
                : "border-border text-text-secondary hover:border-primary hover:text-primary bg-white"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-card border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Nº Pedido</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Total</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Pago</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-medium text-text">{order.order_number}</td>
                <td className="px-4 py-3 text-text-secondary font-light">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 font-light">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[order.status] ?? ""}`}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${
                    order.payment_status === "paid" ? "text-success" : "text-gold"
                  }`}>
                    {order.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-text-muted text-[13px] font-light">
            No hay pedidos {params.status ? `con estado "${params.status}"` : "todavía"}.
          </div>
        )}
      </div>
    </div>
  );
}
