import Link from "next/link";

const CATEGORIES = [
  {
    name: "Bolsos",
    slug: "bolsos",
    description: "Piezas que definen tu estilo",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    description: "Aromas que te acompañan",
    image:
      "https://images.unsplash.com/photo-1588406354037-f4348c95749e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Relojes",
    slug: "relojes",
    description: "El tiempo con elegancia",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=85",
  },
];

export function CategoryGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="content-max">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-3">Categorías</p>
          <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl md:text-5xl text-text font-light">
            Encuentra tu estilo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-card bg-surface-2"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-[family-name:var(--font-cormorant)] italic text-3xl font-light mb-1">
                  {cat.name}
                </h3>
                <p className="text-[12px] uppercase tracking-wider opacity-80">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
