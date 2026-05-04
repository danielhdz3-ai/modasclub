import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Package, Heart, Settings } from "lucide-react";

const CUENTA_NAV = [
  { label: "Mi cuenta", href: "/cuenta", icon: User },
  { label: "Mis pedidos", href: "/cuenta/pedidos", icon: Package },
  { label: "Lista de deseos", href: "/cuenta/wishlist", icon: Heart },
  { label: "Mi perfil", href: "/cuenta/perfil", icon: Settings },
];

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta");

  return (
    <div className="content-max section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-card border border-border p-5">
            <p className="text-[11px] uppercase tracking-wider text-text-muted mb-4">Mi cuenta</p>
            <nav className="space-y-1">
              {CUENTA_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-text-secondary hover:bg-surface-2 hover:text-primary transition-all"
                  >
                    <Icon size={15} strokeWidth={1.5} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
