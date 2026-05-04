"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-lg flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} className="text-primary" />
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-lg text-text">
              Mi carrito
            </h2>
            {items.length > 0 && (
              <span className="text-[11px] text-text-muted">({items.length})</span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Cerrar carrito">
            <X size={20} strokeWidth={1.5} className="text-text-secondary hover:text-text transition-colors" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} strokeWidth={1} className="text-primary-light" />
              <p className="font-[family-name:var(--font-cormorant)] italic text-xl text-text-muted">
                Tu carrito está vacío
              </p>
              <Link href="/productos" onClick={closeCart} className="btn-outline">
                Explorar tienda
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.product_id}-${item.variant_id}`} className="flex gap-3">
                  {/* Image */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-light">
                        <ShoppingBag size={20} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/productos/${item.slug}`}
                      onClick={closeCart}
                      className="text-[13px] text-text hover:text-primary transition-colors line-clamp-2 font-light"
                    >
                      {item.name}
                    </Link>
                    {item.variant_name && (
                      <p className="text-[11px] text-text-muted mt-0.5">{item.variant_name}</p>
                    )}
                    <p className="font-[family-name:var(--font-cormorant)] italic text-[15px] mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        className="w-6 h-6 border border-border rounded flex items-center justify-center hover:border-primary transition-colors"
                        aria-label="Restar"
                      >
                        <Minus size={11} strokeWidth={1.5} />
                      </button>
                      <span className="text-[13px] w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity}
                        className="w-6 h-6 border border-border rounded flex items-center justify-center hover:border-primary transition-colors disabled:opacity-40"
                        aria-label="Sumar"
                      >
                        <Plus size={11} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product_id, item.variant_id)}
                    className="p-1 text-text-muted hover:text-error transition-colors self-start"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-text-secondary font-light">Subtotal</span>
              <span className="font-[family-name:var(--font-cormorant)] italic text-xl text-text">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-text-muted text-center">
              Envío calculado al finalizar el pedido
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full"
            >
              Finalizar pedido
            </Link>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="btn-ghost w-full text-center text-[12px]"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
