import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Términos y condiciones",
  description: "Condiciones de uso ModasClub.",
  canonical: "/terminos",
});

export default function TerminosPage() {
  return (
    <div className="content-max section-padding max-w-2xl">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-6">
        Términos y condiciones
      </h1>
      <p className="text-[15px] text-text-secondary font-light leading-relaxed">
        Al usar ModasClub aceptas estas condiciones generales: uso del sitio, condiciones de venta,
        precios con IVA cuando corresponda, y la política de devoluciones indicada en su página
        específica. Nos reservamos el derecho de actualizar los términos; la versión aplicable es la
        publicada en el momento del pedido.
      </p>
    </div>
  );
}
