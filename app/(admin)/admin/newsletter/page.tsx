import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/formatters";

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 30;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, is_active, subscribed_at", { count: "exact" })
    .order("subscribed_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  const { count: activeCount } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
            Newsletter
          </h1>
          <p className="text-[13px] text-text-muted">
            <span className="text-success font-medium">{activeCount ?? 0}</span> suscriptoras activas
            · {count ?? 0} total
          </p>
        </div>

        {/* Export CSV */}
        <a
          href="/api/admin/newsletter/export"
          className="btn-outline text-[13px] px-4 py-2"
        >
          Exportar CSV
        </a>
      </div>

      <div className="bg-white rounded-card border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-2 border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Email</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Estado</th>
            </tr>
          </thead>
          <tbody>
            {subscribers?.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-light text-text">{s.email}</td>
                <td className="px-4 py-3 text-text-secondary font-light">{s.name ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary font-light">{formatDate(s.subscribed_at)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    s.is_active ? "bg-success/10 text-success" : "bg-error/10 text-error"
                  }`}>
                    {s.is_active ? "Activa" : "Baja"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!subscribers || subscribers.length === 0) && (
          <div className="text-center py-12 text-text-muted text-[13px] font-light">
            Aún no hay suscriptoras.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-5 justify-end">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i}
              href={`/admin/newsletter?page=${i + 1}`}
              className={`w-8 h-8 flex items-center justify-center rounded text-[12px] transition-all ${
                page === i + 1 ? "bg-primary text-white" : "bg-white border border-border text-text-secondary hover:border-primary"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
