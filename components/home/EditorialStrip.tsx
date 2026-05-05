import Image from "next/image";

const SHOTS = [
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=85&auto=format&fit=crop",
    alt: "Modelo con bolso, sonrisa",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027614a5?w=600&q=85&auto=format&fit=crop",
    alt: "Amigas de compras con bolsos",
  },
  {
    src: "https://images.unsplash.com/photo-1558769132-cbfb1cb55edb?w=600&q=85&auto=format&fit=crop",
    alt: "Detalle de complementos de moda",
  },
];

export function EditorialStrip() {
  return (
    <section className="py-10 bg-white">
      <div className="content-max">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-text-muted mb-8">
          Momentos ModasClub
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {SHOTS.map((shot) => (
            <div
              key={shot.src}
              className="relative aspect-[3/4] rounded-card overflow-hidden group"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-card pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
