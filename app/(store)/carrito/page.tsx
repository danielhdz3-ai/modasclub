"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils/constants";

export default function CarritoPage() {
  useCart(); // Rehydrate

  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="content-max section-padding text-center py-24">
        <ShoppingBag size={48} strokeWidth={0.8} className="text-text-muted mx-auto mb-4" />
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-3">
          Tu carrito está vacío
        </h1>
        <p className="text-[14px] text-text-muted font-light mb-8">
          Descubre nuestra selección de bolsos, perfumes y relojes.
        </p>
        <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
          Ver productos <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="content-max section-padding">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-8">
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.cartItemId} className="bg-white rounded-card border border-border p-4 flex gap-4">
              <div className="w-20 h-20 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-lg">
                    {item.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-light text-text text-[14px] truncate">{item.name}</p>
                {item.variant && (
                  <p className="text-[12px] text-text-muted mt-0.5">{item.variant}</p>
                )}
                <p className="font-[family-name:var(--font-cormorant)] italic text-[18px] mt-1 text-text">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>

                <div className="flex items-center border border-border rounded-pill overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="px-2.5 py-1.5 hover:bg-surface-2 text-text-secondary transition-colors"
                  >
                    <Minus size={12} strokeWidth={2} />
                  </button>
                  <span className="px-3 text-[13px] font-medium text-text">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="px-2.5 py-1.5 hover:bg-surface-2 text-text-secondary transition-colors"
                  >
                    <Plus size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-[12px] text-text-muted hover:text-error transition-colors"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-card border border-border p-6 sticky top-24">
            <h2 className="font-medium text-[14px] mb-5">Resumen del pedido</h2>

            {/* Shipping progress */}
            <div className="mb-5 p-3 bg-surface-2 rounded-lg">
              {shippingFree ? (
                <p className="text-[12px] text-success text-center">
                  ✓ ¡Envío gratuito incluido!
                </p>
              ) : (
                <div>
                  <p className="text-[12px] text-text-secondary mb-2">
                    Te faltan <strong>{formatPrice(remaining)}</strong> para envío gratis
                  </p>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all rounded-full"
                      style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 text-[13px] mb-5">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-light">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span className={shippingFree ? "text-success" : "font-light"}>
                  {shippingFree ? "Gratis" : "Calculado al pagar"}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-medium text-text text-[14px]">
                <span>Total estimado</span>
                <span className="font-[family-name:var(--font-cormorant)] italic text-xl">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Finalizar compra <ArrowRight size={14} strokeWidth={1.5} />
            </Link>

            <Link
              href="/productos"
              className="mt-3 text-center text-[12px] text-text-muted hover:text-primary transition-colors block"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
