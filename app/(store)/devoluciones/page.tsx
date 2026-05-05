import Link from "next/link";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Devoluciones",
  description: "Política de devoluciones ModasClub.",
  canonical: "/devoluciones",
});

export default function DevolucionesPage() {
  return (
    <div className="content-max section-padding max-w-2xl">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-6">
        Devoluciones
      </h1>
      <div className="space-y-4 text-[15px] text-text-secondary font-light leading-relaxed">
        <p>
          Aceptamos devoluciones dentro de los <strong className="font-normal text-text">14 días naturales</strong>{" "}
          desde la recepción del pedido, siempre que los artículos estén sin uso, con etiquetas y embalaje
          original.
        </p>
        <p>
          Para iniciar una devolución, escríbenos desde{" "}
          <Link href="/contacto" className="text-primary hover:underline">
            contacto
          </Link>{" "}
          indicando tu número de pedido. Te guiaremos en los siguientes pasos.
        </p>
        <p className="text-[13px] text-text-muted">
          Los gastos de envío de devolución pueden aplicarse salvo defecto o error nuestro. En caso de
          producto defectuoso, asumimos el coste.
        </p>
      </div>
    </div>
  );
}
