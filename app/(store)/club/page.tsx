import Image from "next/image";
import Link from "next/link";
import { Check, Star, Crown } from "lucide-react";
import { APP_NAME } from "@/lib/utils/constants";

export const metadata = {
  title: `El Club · ${APP_NAME}`,
  description: "Únete al club ModasClub. Precios exclusivos para miembros, acceso anticipado a colecciones y envíos preferentes.",
};

const BENEFITS = [
  "Precios exclusivos hasta un 15% más baratos",
  "Acceso anticipado a nuevas colecciones",
  "Envío gratis en todos tus pedidos",
  "Atención personalizada prioritaria",
  "Descuentos en marcas premium",
  "Newsletter con tendencias de moda",
];

export default function ClubPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-pale to-nude-light py-20">
        <div className="content-max text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 rounded-pill px-4 py-2 mb-6">
            <Crown size={14} strokeWidth={1.5} className="text-gold" />
            <span className="text-[11px] uppercase tracking-widest text-gold font-medium">Membresía exclusiva</span>
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-5xl md:text-6xl text-text mb-4">
            El Club ModasClub
          </h1>
          <p className="text-[16px] text-text-secondary font-light max-w-xl mx-auto mb-10">
            Una membresía para las que saben que la moda es una inversión, no un gasto.
          </p>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Monthly */}
            <div className="bg-white rounded-card border border-border p-7 shadow-card text-left">
              <p className="text-[11px] uppercase tracking-wider text-text-muted mb-3">Mensual</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text">9,99€</span>
                <span className="text-text-muted text-[13px] mb-1">/mes</span>
              </div>
              <p className="text-[12px] text-text-muted mb-6">Cancela cuando quieras</p>
              <Link href="/registro" className="btn-outline w-full text-center block">
                Empezar mensual
              </Link>
            </div>

            {/* Annual — recommended */}
            <div className="bg-primary rounded-card p-7 text-white shadow-btn text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-pill font-medium">
                Más popular
              </div>
              <p className="text-[11px] uppercase tracking-wider text-white/70 mb-3">Anual</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-[family-name:var(--font-cormorant)] italic text-4xl">89€</span>
                <span className="text-white/70 text-[13px] mb-1">/año</span>
              </div>
              <p className="text-[12px] text-white/70 mb-6">7,42€/mes · <strong className="text-white">Ahorras 31€</strong></p>
              <Link
                href="/registro"
                className="w-full text-center block bg-white text-primary font-medium py-3 rounded-pill hover:bg-nude transition-colors text-[14px]"
              >
                Empezar anual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding content-max">
        <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text text-center mb-12">
          Todo lo que incluye
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-start gap-3 p-5 bg-surface-2 rounded-card">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={10} strokeWidth={3} className="text-white" />
              </div>
              <p className="text-[13px] text-text-secondary font-light leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-surface-2">
        <div className="content-max">
          <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text text-center mb-10">
            Ellas ya son miembros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Sofía M.",
                text: "Me ahorro el precio de la membresía en el primer mes con los descuentos. ¡Una joya!",
                stars: 5,
              },
              {
                name: "Laura G.",
                text: "El acceso anticipado a colecciones es increíble. Siempre tengo las novedades antes que nadie.",
                stars: 5,
              },
              {
                name: "Carmen R.",
                text: "El servicio al cliente para miembros es otro nivel. Responden en menos de una hora.",
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-card border border-border p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={12} strokeWidth={1} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-[13px] text-text-secondary font-light italic mb-4">"{t.text}"</p>
                <p className="text-[12px] font-medium text-text">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding content-max text-center">
        <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-4">
          ¿Lista para unirte?
        </h2>
        <p className="text-[15px] text-text-muted font-light mb-8 max-w-md mx-auto">
          Más de 5.000 mujeres ya disfrutan de los beneficios exclusivos del club.
        </p>
        <Link href="/registro" className="btn-primary inline-flex items-center gap-2 text-[15px] px-8 py-3">
          Crear mi cuenta gratis
        </Link>
      </section>
    </div>
  );
}
