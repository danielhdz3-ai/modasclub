const SHOTS = [
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85",
    alt: "Modelo con bolso, sonrisa",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027614a5?auto=format&fit=crop&w=800&q=85",
    alt: "Amigas de compras con bolsos",
  },
  {
    src: "https://images.unsplash.com/photo-1558769132-cbfb1cb55edb?auto=format&fit=crop&w=800&q=85",
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
              className="group relative aspect-[3/4] overflow-hidden rounded-card bg-surface-2"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-black/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
