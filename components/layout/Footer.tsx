import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

const LINKS = {
  tienda: [
    { label: "Bolsos", href: "/categoria/bolsos" },
    { label: "Perfumes", href: "/categoria/perfumes" },
    { label: "Relojes", href: "/categoria/relojes" },
    { label: "Novedades", href: "/productos?sort=newest" },
  ],
  club: [
    { label: "¿Qué es el Club?", href: "/club" },
    { label: "Beneficios", href: "/club#beneficios" },
    { label: "Unirse", href: "/club#unirse" },
  ],
  ayuda: [
    { label: "Sobre nosotros", href: "/sobre-nosotras" },
    { label: "Contacto", href: "/contacto" },
    { label: "Devoluciones", href: "/devoluciones" },
    { label: "Envíos", href: "/envios" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#FDF0F0] border-t border-border mt-20">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Logo centrado */}
        <div className="flex flex-col items-center mb-12">
          <BrandLogo size="lg" />
          <p className="mt-2 text-[13px] text-text-muted font-light font-[family-name:var(--font-pinyon)] text-xl">
            Moda con alma
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium text-text mb-4">
                {section === "tienda" ? "Tienda" : section === "club" ? "El Club" : "Ayuda"}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-text-secondary hover:text-primary font-light transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separador */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-text-muted font-light">
            © {new Date().getFullYear()} ModasClub. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-[12px] text-text-muted hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link href="/cookies" className="text-[12px] text-text-muted hover:text-primary transition-colors">
              Cookies
            </Link>
            <Link href="/terminos" className="text-[12px] text-text-muted hover:text-primary transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
