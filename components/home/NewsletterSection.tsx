"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        addToast({ message: "¡Suscrita! Revisa tu email para tu descuento de bienvenida.", type: "success" });
      } else {
        addToast({ message: "Ya estás suscrita o algo salió mal. Inténtalo de nuevo.", type: "error" });
      }
    } catch {
      addToast({ message: "Error de conexión. Inténtalo de nuevo.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-surface-2">
      <div className="content-max">
        <div className="relative rounded-[20px] overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-card overflow-hidden hidden md:block bg-surface-2">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
              alt="Mujer leyendo con café, luz natural"
              className="absolute inset-0 h-full w-full object-cover"
              width={1000}
              height={750}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Content */}
          <div className="px-4 md:px-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-3">Newsletter</p>
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text font-light leading-tight mb-4">
              Novedades y
              <br />
              <span className="text-primary-hover">descuentos</span> exclusivos
            </h2>
            <p className="text-[14px] text-text-secondary font-light mb-8 leading-relaxed">
              Suscríbete y recibe un{" "}
              <strong className="font-medium text-primary">10% de descuento</strong> en tu primer pedido,
              acceso anticipado a nuevas colecciones y ofertas solo para suscriptoras.
            </p>

            {done ? (
              <div className="bg-success/10 border border-success/20 rounded-card p-4">
                <p className="text-[14px] text-success font-medium">
                  ✓ ¡Bienvenida! Revisa tu email para tu código de descuento.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="primary" loading={loading}>
                  Suscribirme
                </Button>
              </form>
            )}

            <p className="text-[11px] text-text-muted mt-4">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
