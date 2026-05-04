import { APP_NAME } from "@/lib/utils/constants";

export const metadata = {
  title: `Sobre Nosotras · ${APP_NAME}`,
  description: "Conoce la historia de ModasClub, tu tienda de moda femenina online especializada en bolsos, perfumes y relojes.",
};

export default function SobreNosotrasPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-pale to-white py-20">
        <div className="content-max text-center">
          <h1 className="font-[family-name:var(--font-cormorant)] italic text-5xl md:text-6xl text-text mb-4">
            Sobre ModasClub
          </h1>
          <p className="text-[16px] text-text-secondary font-light max-w-lg mx-auto">
            Una tienda creada por mujeres que aman la moda, para mujeres que merecen lo mejor.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding content-max">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-5">
              Nuestra historia
            </h2>
            <div className="space-y-4 text-[14px] text-text-secondary font-light leading-relaxed">
              <p>
                ModasClub nació de la convicción de que la moda de calidad debe ser accesible.
                Cansadas de pagar precios inflados por accesorios de lujo, decidimos crear
                una alternativa: una boutique online donde el estilo y el precio se dan la mano.
              </p>
              <p>
                Trabajamos directamente con proveedores de confianza para ofrecerte
                bolsos, perfumes y relojes de tendencia a precios justos. Sin intermediarios,
                sin sorpresas.
              </p>
              <p>
                Y para las más apasionadas de la moda, creamos <strong className="text-text">el Club</strong>:
                una membresía exclusiva con precios aún más especiales, acceso anticipado
                y un servicio verdaderamente personalizado.
              </p>
            </div>
          </div>
          <div className="bg-nude-light rounded-card h-80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
              alt="ModasClub boutique"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface-2">
        <div className="content-max text-center">
          <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-12">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "Calidad",
                desc: "Seleccionamos cada producto con criterio. Solo lo que pasaría nuestra prueba personal.",
              },
              {
                title: "Transparencia",
                desc: "Precios claros, sin letra pequeña. Sabes exactamente lo que pagas y por qué.",
              },
              {
                title: "Comunidad",
                desc: "Somos un club, no una tienda. Una comunidad de mujeres que comparten el amor por la moda.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-card border border-border p-6">
                <h3 className="font-[family-name:var(--font-cormorant)] italic text-2xl text-text mb-3">
                  {v.title}
                </h3>
                <p className="text-[13px] text-text-secondary font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
