import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils/formatters";
import { ORDER_STATUS_LABELS } from "@/lib/utils/constants";
import { Package } from "lucide-react";
import Link from "next/link";

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, payment_status")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-6">
        Mis pedidos
      </h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-card border border-border p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-[14px] text-text">{order.order_number}</p>
                <p className="text-[12px] text-text-muted mt-0.5">{formatDate(order.created_at)}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                  order.status === "delivered" ? "bg-success/10 text-success" :
                  order.status === "cancelled" ? "bg-error/10 text-error" :
                  "bg-gold/10 text-gold"
                }`}>
                  {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="font-[family-name:var(--font-cormorant)] italic text-2xl text-text">
                  {formatPrice(order.total)}
                </p>
                <p className={`text-[11px] uppercase tracking-wider mt-1 ${
                  order.payment_status === "paid" ? "text-success" : "text-text-muted"
                }`}>
                  {order.payment_status === "paid" ? "Pagado" : "Pendiente"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-card border border-border text-center py-16">
          <Package size={40} strokeWidth={1} className="text-text-muted mx-auto mb-4" />
          <p className="text-[14px] text-text-secondary font-light mb-6">
            Todavía no has realizado ningún pedido.
          </p>
          <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
            Descubrir productos
          </Link>
        </div>
      )}
    </div>
  );
}
