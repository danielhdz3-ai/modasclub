import Image from "next/image";
import Link from "next/link";

const SIDE_IMG =
  "https://images.unsplash.com/photo-1483989563090-c0f25e8de2d5?w=900&q=85&auto=format&fit=crop";

export function BoutiqueStory() {
  return (
    <section className="section-padding bg-[#FBF7F5] border-y border-border/60">
      <div className="content-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] max-h-[560px] rounded-card overflow-hidden shadow-lg order-2 lg:order-1">
            <Image
              src={SIDE_IMG}
              alt="ModasClub — estilo y complicidad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white font-[family-name:var(--font-cormorant)] italic text-2xl md:text-3xl font-light drop-shadow-md">
              «Elegancia sin prisa»
            </p>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
              La boutique
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl md:text-5xl text-text font-light leading-tight">
              ModasClub es tu rincón de lujo accesible
            </h2>
            <p className="text-[15px] text-text-secondary font-light leading-relaxed">
              Nacimos para acercarte piezas que brillan: bolsos con carácter, perfumes que cuentan una
              historia y relojes que marcan el ritmo de tu día. Seleccionamos cada artículo con mimo,
              como en una boutique de barrio—pero con el surtido de una casa de moda.
            </p>
            <p className="text-[15px] text-text-secondary font-light leading-relaxed">
              Socias del <strong className="font-normal text-text">Club</strong> disfrutan precios
              reservados y novedades antes que nadie. Porque creemos que vestir bien es una forma de
              celebrarte.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/sobre-nosotras" className="btn-outline px-10 py-4 text-[14px]">
                Nuestra historia
              </Link>
              <Link href="/club" className="btn-primary px-10 py-4 text-[14px]">
                Ventajas del Club
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
