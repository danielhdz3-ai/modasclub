import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const BENEFITS = [
  "Precios exclusivos hasta un 20% más baratos",
  "Envío gratuito en todos tus pedidos",
  "Acceso anticipado a nuevas colecciones",
  "Devoluciones prioritarias sin coste",
  "Descuentos especiales en perfumes de lujo",
];

export function ClubBanner() {
  return (
    <section className="section-padding bg-white">
      <div className="content-max">
        <div className="relative rounded-[20px] overflow-hidden bg-surface-2 grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          {/* Content */}
          <div className="flex flex-col justify-center p-10 md:p-14 z-10">
            <p className="font-[family-name:var(--font-pinyon)] text-3xl text-primary mb-3">
              únete
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl md:text-5xl text-text font-light leading-tight mb-6">
              El Club de las
              <br />
              <span className="text-primary-hover">que saben</span>
            </h2>
            <ul className="space-y-2 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] text-text-secondary font-light">
                  <Check size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/club">
                <Button variant="primary">
                  Unirme por 9,99€/mes
                </Button>
              </Link>
              <Link href="/club" className="text-[12px] text-text-muted hover:text-primary transition-colors">
                Saber más →
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden min-h-[400px] md:block bg-surface-2">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
              alt="Mujeres amigas comprando, luz natural"
              className="absolute inset-0 h-full w-full object-cover"
              width={1000}
              height={800}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-2/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
