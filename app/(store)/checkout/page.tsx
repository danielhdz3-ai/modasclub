"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils/constants";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";
import { Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  useCart();
  const router = useRouter();
  const { addToast } = useUIStore();
  const { items, getSubtotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const subtotal = getSubtotal();
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;

  const handleCheckout = async () => {
    if (!items.length) return;
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product_id,
            variantId: i.variant_id,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        router.push(data.url);
      } else {
        addToast({ message: data.error ?? "Error al iniciar el pago", type: "error" });
      }
    } catch {
      addToast({ message: "Error de conexión", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="content-max section-padding text-center py-24">
        <ShoppingBag size={40} strokeWidth={1} className="text-text-muted mx-auto mb-4" />
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-6">
          Tu carrito está vacío
        </h1>
        <Link href="/productos" className="btn-primary inline-block">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="content-max section-padding max-w-2xl mx-auto">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-8">
        Confirmar pedido
      </h1>

      {/* Order summary */}
      <div className="bg-white rounded-card border border-border p-6 mb-6">
        <h2 className="font-medium text-[14px] mb-4">Tu pedido</h2>
        <div className="space-y-3 divide-y divide-border">
          {items.map((item) => (
            <div key={`${item.product_id}-${item.variant_id ?? "default"}`} className="flex justify-between pt-3 first:pt-0 text-[13px]">
              <div>
                <p className="text-text font-light">{item.name}</p>
                {item.variant_name && <p className="text-text-muted text-[11px]">{item.variant_name}</p>}
                <p className="text-text-muted text-[11px]">× {item.quantity}</p>
              </div>
              <p className="font-[family-name:var(--font-cormorant)] italic text-[16px] text-text">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-4 pt-4 space-y-2 text-[13px]">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Envío</span>
            <span className={shippingFree ? "text-success" : ""}>{shippingFree ? "Gratis" : "Calculado en Stripe"}</span>
          </div>
          <div className="flex justify-between font-medium text-[15px] pt-1 border-t border-border">
            <span>Total</span>
            <span className="font-[family-name:var(--font-cormorant)] italic text-xl">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Proceed */}
      <Button
        variant="primary"
        onClick={handleCheckout}
        loading={loading}
        className="w-full text-[15px] py-4"
      >
        <Lock size={14} strokeWidth={1.5} />
        Pagar con Stripe
      </Button>

      <p className="text-center text-[11px] text-text-muted mt-4 flex items-center justify-center gap-1.5">
        <Lock size={10} strokeWidth={2} />
        Pago 100% seguro con Stripe · SSL cifrado
      </p>

      <p className="text-center mt-3">
        <Link href="/carrito" className="text-[12px] text-text-muted hover:text-primary transition-colors">
          ← Volver al carrito
        </Link>
      </p>
    </div>
  );
}
