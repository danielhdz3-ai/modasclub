import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";
import { BrandLogo } from "@/components/layout/BrandLogo";

const AUTH_SIDE =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85&auto=format&fit=crop";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface">
      <ToastContainer />
      <div className="relative hidden lg:block lg:w-[48%] min-h-screen">
        <Image
          src={AUTH_SIDE}
          alt=""
          fill
          className="object-cover object-[center_15%]"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-black/10" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-[family-name:var(--font-pinyon)] text-3xl mb-2 opacity-95">ModasClub</p>
          <p className="text-sm font-light text-white/85 max-w-sm leading-relaxed">
            Entra y descubre bolsos, perfumes y relojes seleccionados con alma—como en tu boutique de
            confianza, pero online.
          </p>
        </div>
        <Link
          href="/"
          className="absolute top-8 left-8 text-white/90 text-[12px] uppercase tracking-widest hover:text-white"
        >
          ← Volver a la tienda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <BrandLogo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
