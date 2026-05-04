import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils/formatters";
import { ORDER_STATUS_LABELS } from "@/lib/utils/constants";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function CuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: recentOrders }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-card border border-border p-6">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-1">
          Hola, {profile?.full_name?.split(" ")[0] ?? "bienvenida"}
        </h1>
        <p className="text-[13px] text-text-muted font-light">{user!.email}</p>

        {profile?.membership_status === "active" && (
          <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-pill px-3 py-1.5">
            <span className="text-gold text-[11px] font-medium uppercase tracking-wider">★ Miembro Club</span>
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-[14px]">Últimos pedidos</h2>
          <Link href="/cuenta/pedidos" className="text-[12px] text-primary hover:text-primary-hover transition-colors">
            Ver todos →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg text-[13px]">
                <div>
                  <p className="font-medium text-text">{order.order_number}</p>
                  <p className="text-text-muted text-[11px] mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-cormorant)] italic text-[16px] text-text">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider">
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package size={32} strokeWidth={1} className="text-text-muted mx-auto mb-3" />
            <p className="text-[13px] text-text-muted font-light">Aún no tienes pedidos</p>
            <Link href="/productos" className="mt-3 text-[13px] text-primary hover:text-primary-hover inline-block">
              Empezar a comprar →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
