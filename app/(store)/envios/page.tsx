import Link from "next/link";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Envíos",
  description: "Información de envíos ModasClub.",
  canonical: "/envios",
});

export default function EnviosPage() {
  return (
    <div className="content-max section-padding max-w-2xl">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-6">Envíos</h1>
      <div className="space-y-4 text-[15px] text-text-secondary font-light leading-relaxed">
        <p>
          Trabajamos con mensajería nacional. Los plazos orientativos son de{" "}
          <strong className="font-normal text-text">2 a 5 días laborables</strong> en península, según
          destino y época del año.
        </p>
        <p>
          El envío puede ser gratuito a partir de un importe mínimo (consulta el umbral en el carrito antes
          de pagar). Si tienes dudas sobre tu pedido, usa{" "}
          <Link href="/contacto" className="text-primary hover:underline">
            contacto
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
