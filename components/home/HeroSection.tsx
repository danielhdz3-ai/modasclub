import Link from "next/link";
import Image from "next/image";

const HERO_MAIN =
  "https://images.unsplash.com/photo-1539100916881-1323bbe728f0?w=1400&q=85&auto=format&fit=crop";
const HERO_ACCENT =
  "https://images.unsplash.com/photo-1576566588028-4147f384dc1c?w=800&q=85&auto=format&fit=crop";

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex flex-col lg:flex-row overflow-hidden bg-[#1a1012]">
      {/* Imagen principal — editorial */}
      <div className="relative w-full lg:w-[58%] min-h-[52vh] lg:min-h-[88vh]">
        <Image
          src={HERO_MAIN}
          alt="ModasClub — mujeres con estilo y bolsos"
          fill
          className="object-cover object-[center_20%]"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/55" />
        <div className="absolute bottom-6 left-6 right-6 lg:hidden text-center">
          <p className="text-white/90 font-[family-name:var(--font-pinyon)] text-2xl drop-shadow-md">
            Tu boutique online
          </p>
        </div>
      </div>

      {/* Contenido + acento visual */}
      <div className="relative flex-1 flex flex-col justify-center bg-gradient-to-b from-[#2d1a1f] via-[#3d2229] to-[#2d1a1f] text-white px-6 py-14 lg:px-12 lg:py-20">
        <div className="absolute top-8 right-8 w-28 h-36 hidden lg:block rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/10 rotate-3 opacity-95">
          <Image src={HERO_ACCENT} alt="" fill className="object-cover" sizes="112px" />
        </div>

        <div className="relative max-w-md">
          <p className="font-[family-name:var(--font-pinyon)] text-2xl md:text-3xl text-[#f5c6d6] mb-4">
            nueva colección
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl font-light italic leading-[1.05] mb-6">
            Moda que te
            <br />
            <span className="text-[#f5c6d6]">inspira</span>
          </h1>
          <p className="text-[15px] text-white/80 font-light leading-relaxed mb-8 max-w-sm border-l-2 border-[#f5c6d6]/50 pl-4">
            Bolsos, perfumes y relojes seleccionados con alma—piezas de vestir con botón de{" "}
            <strong className="font-normal text-white">glamour cotidiano</strong>. Precios especiales
            para socias del Club.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/productos" className="btn-primary shadow-lg shadow-black/20 text-center">
              Explorar colección
            </Link>
            <Link
              href="/club"
              className="btn-outline border-white/60 text-white bg-white/5 hover:bg-white/15 hover:text-white text-center"
            >
              Unirse al Club
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
