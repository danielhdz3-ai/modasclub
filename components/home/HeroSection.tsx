import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-surface">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027614a5?w=1400&q=85&fit=crop&crop=faces,center"
          alt="Mujer con bolso en jardín, luz natural"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative content-max w-full px-4 py-20">
        <div className="max-w-lg">
          <p className="font-[family-name:var(--font-pinyon)] text-3xl text-primary mb-4 opacity-90">
            nueva colección
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl font-light italic text-text leading-tight mb-6">
            Moda que te
            <br />
            <span className="text-primary-hover">inspira</span>
          </h1>
          <p className="text-[15px] text-text-secondary font-light leading-relaxed mb-8 max-w-sm">
            Bolsos, perfumes y relojes seleccionados con alma. Precios exclusivos para socias del Club.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/productos">
              <Button variant="primary" size="lg">
                Explorar colección
              </Button>
            </Link>
            <Link href="/club">
              <Button variant="outline" size="lg">
                Unirse al Club
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
