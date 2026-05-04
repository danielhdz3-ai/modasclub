import { APP_NAME } from "@/lib/utils/constants";

export default function ConfiguracionPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-8">
        Configuración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        {/* Store info */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Información de la tienda</h2>
          <div className="space-y-3 text-[13px]">
            {[
              { label: "Nombre", value: APP_NAME },
              { label: "URL", value: process.env.NEXT_PUBLIC_APP_URL ?? "—" },
              { label: "Email", value: "info@modasclub.com" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-text-muted">{item.label}</span>
                <span className="font-light text-text">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations status */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Integraciones</h2>
          <div className="space-y-3 text-[13px]">
            {[
              { label: "Supabase", key: "NEXT_PUBLIC_SUPABASE_URL" },
              { label: "Stripe", key: "STRIPE_SECRET_KEY" },
              { label: "Resend", key: "RESEND_API_KEY" },
              { label: "Claude IA", key: "ANTHROPIC_API_KEY" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-text-muted">{item.label}</span>
                <span className={`text-[11px] font-medium uppercase tracking-wider ${
                  process.env[item.key] ? "text-success" : "text-error"
                }`}>
                  {process.env[item.key] ? "Configurado" : "Falta API key"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Envío</h2>
          <div className="space-y-3 text-[13px]">
            {[
              { label: "Envío gratis desde", value: "50,00 €" },
              { label: "Países aceptados", value: "ES, PT, FR, DE, IT" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-text-muted">{item.label}</span>
                <span className="font-light text-text">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-medium text-[14px] mb-4">Membresía Club</h2>
          <div className="space-y-3 text-[13px]">
            {[
              { label: "Plan mensual", value: "9,99 €/mes" },
              { label: "Plan anual", value: "89 €/año" },
              { label: "Descuento miembro", value: "~15% (margen 1.9x)" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-text-muted">{item.label}</span>
                <span className="font-light text-text">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
