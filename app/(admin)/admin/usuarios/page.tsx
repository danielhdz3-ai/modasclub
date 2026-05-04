import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/formatters";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("id, email, full_name, role, membership_status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (params.search) query = query.ilike("email", `%${params.search}%`);

  const { data: users, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  const MEMBERSHIP_COLORS: Record<string, string> = {
    free: "bg-border text-text-muted",
    active: "bg-gold/10 text-gold",
    cancelled: "bg-error/10 text-error",
    expired: "bg-surface-2 text-text-muted",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-1">
          Usuarias
        </h1>
        <p className="text-[13px] text-text-muted">{count ?? 0} registradas</p>
      </div>

      <form className="flex gap-3 mb-5">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Buscar por email..."
          className="input-base text-[13px] py-2 px-3 max-w-xs"
        />
        <button type="submit" className="btn-outline text-[13px] px-4 py-2">Buscar</button>
      </form>

      <div className="bg-white rounded-card border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-2 border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Email</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Membresía</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Rol</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Registro</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-light text-text">{u.email}</td>
                <td className="px-4 py-3 text-text-secondary font-light">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${MEMBERSHIP_COLORS[u.membership_status] ?? ""}`}>
                    {u.membership_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role === "admin" && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-primary-pale text-primary">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary font-light">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <div className="text-center py-12 text-text-muted text-[13px] font-light">
            No se encontraron usuarias.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-5 justify-end">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i}
              href={`/admin/usuarios?page=${i + 1}${params.search ? `&search=${params.search}` : ""}`}
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
