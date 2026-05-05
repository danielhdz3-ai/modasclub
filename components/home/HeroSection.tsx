import Link from "next/link";

/** URLs directas (sin pasar por el optimizador de Next) — evita fallos en Vercel + Unsplash. */
const HERO_MAIN_SRC =
  "https://images.unsplash.com/photo-1529139574466-a303027614a5?auto=format&fit=crop&w=1920&q=85";
const HERO_ACCENT_SRC =
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=640&q=85";

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex flex-col lg:flex-row overflow-hidden bg-[#2d1a1f]">
      {/* Columna imagen: fondo elegante si la foto tarda o falla */}
      <div className="relative w-full lg:w-[58%] min-h-[52vh] lg:min-h-[88vh] bg-gradient-to-br from-[#3d2529] via-[#2a181c] to-[#1a1012]">
        <img
          src={HERO_MAIN_SRC}
          alt="ModasClub — mujeres con estilo y bolsos"
          className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/15 lg:to-black/45" />
        <div className="absolute bottom-6 left-6 right-6 text-center lg:hidden">
          <p className="font-[family-name:var(--font-pinyon)] text-2xl text-white/95 drop-shadow-md">
            Tu boutique online
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center bg-gradient-to-b from-[#2d1a1f] via-[#3d2229] to-[#2d1a1f] px-6 py-14 text-white lg:px-12 lg:py-20">
        <div className="absolute right-8 top-8 hidden h-36 w-28 rotate-3 overflow-hidden rounded-lg shadow-2xl ring-2 ring-white/10 lg:block bg-[#3d2529]">
          <img
            src={HERO_ACCENT_SRC}
            alt=""
            className="h-full w-full object-cover"
            width={320}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 font-[family-name:var(--font-pinyon)] text-2xl text-[#f5c6d6] md:text-3xl">
            nueva colección
          </p>
          <h1 className="mb-6 font-[family-name:var(--font-cormorant)] text-5xl font-light italic leading-[1.05] md:text-6xl lg:text-7xl">
            Moda que te
            <br />
            <span className="text-[#f5c6d6]">inspira</span>
          </h1>
          <p className="mb-8 max-w-sm border-l-2 border-[#f5c6d6]/50 pl-4 text-[15px] font-light leading-relaxed text-white/85">
            Bolsos, perfumes y relojes seleccionados con alma—piezas con{" "}
            <strong className="font-normal text-white">glamour cotidiano</strong>. Precios especiales para
            socias del Club.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/productos"
              className="btn-primary text-center shadow-lg shadow-black/25"
            >
              Explorar colección
            </Link>
            <Link
              href="/club"
              className="btn-outline border-white/60 bg-white/5 text-center text-white hover:bg-white/15 hover:text-white"
            >
              Unirse al Club
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
