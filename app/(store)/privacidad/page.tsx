import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Privacidad",
  description: "Política de privacidad ModasClub.",
  canonical: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <div className="content-max section-padding max-w-2xl">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-6">
        Privacidad
      </h1>
      <p className="text-[15px] text-text-secondary font-light leading-relaxed">
        ModasClub trata tus datos para gestionar pedidos, cuenta y comunicaciones relacionadas con el
        servicio. Puedes ejercer tus derechos de acceso, rectificación y supresión contactándonos. Esta
        página resume el compromiso; para el texto legal completo, solicita una copia actualizada al equipo.
      </p>
    </div>
  );
}
