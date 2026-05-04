import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const metrics = [
    { label: "Productos activos", value: totalProducts ?? 0, href: "/admin/productos" },
    { label: "Pedidos totales", value: totalOrders ?? 0, href: "/admin/pedidos" },
    { label: "Pedidos pendientes", value: pendingOrders ?? 0, href: "/admin/pedidos?status=pending", alert: (pendingOrders ?? 0) > 0 },
    { label: "Usuarias registradas", value: totalUsers ?? 0, href: "/admin/usuarios" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {metrics.map((m) => (
          <a
            key={m.label}
            href={m.href}
            className={`bg-white rounded-card border p-6 hover:shadow-card transition-all ${
              m.alert ? "border-error/30 bg-error/5" : "border-border"
            }`}
          >
            <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">{m.label}</p>
            <p className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text">
              {m.value}
            </p>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            {[
              { label: "Importar productos CSV/Excel", href: "/admin/proveedores" },
              { label: "Añadir producto manualmente", href: "/admin/productos/nuevo" },
              { label: "Gestionar pedidos", href: "/admin/pedidos" },
              { label: "Ver newsletter", href: "/admin/newsletter" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 transition-colors text-[13px] text-text-secondary hover:text-primary"
              >
                {link.label}
                <span>→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Estado del sistema</h2>
          <div className="space-y-3">
            {[
              { label: "Base de datos Supabase", ok: true },
              { label: "Stripe pagos", ok: !!process.env.STRIPE_SECRET_KEY },
              { label: "Resend emails", ok: !!process.env.RESEND_API_KEY },
              { label: "Claude IA", ok: !!process.env.ANTHROPIC_API_KEY },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[13px]">
                <span className="text-text-secondary">{s.label}</span>
                <span className={`text-[11px] font-medium uppercase tracking-wider ${s.ok ? "text-success" : "text-error"}`}>
                  {s.ok ? "Activo" : "No configurado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
