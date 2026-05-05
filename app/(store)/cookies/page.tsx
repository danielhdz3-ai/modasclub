import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Cookies",
  description: "Uso de cookies en ModasClub.",
  canonical: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="content-max section-padding max-w-2xl">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-6">Cookies</h1>
      <p className="text-[15px] text-text-secondary font-light leading-relaxed">
        Utilizamos cookies necesarias para el funcionamiento del sitio (sesión, carrito) y, cuando las
        aceptes, analíticas para mejorar la experiencia. Puedes configurar tu navegador para bloquear
        cookies, aunque algunas funciones podrían dejar de estar disponibles.
      </p>
    </div>
  );
}
