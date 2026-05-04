"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/utils/formatters";

export default function WishlistPage() {
  useWishlist();
  const { items, removeItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-6">
          Lista de deseos
        </h1>
        <div className="bg-white rounded-card border border-border text-center py-16">
          <Heart size={40} strokeWidth={1} className="text-text-muted mx-auto mb-4" />
          <p className="text-[14px] text-text-secondary font-light mb-6">
            Tu lista de deseos está vacía.
          </p>
          <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
            Descubrir productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-6">
        Lista de deseos ({items.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.product_id} className="bg-white rounded-card border border-border p-4 flex gap-4">
            <div className="w-20 h-20 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  {item.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/productos/${item.slug}`}
                className="font-light text-[13px] text-text hover:text-primary transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="font-[family-name:var(--font-cormorant)] italic text-[18px] mt-1 text-text">
                {formatPrice(item.price)}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.product_id)}
              className="text-text-muted hover:text-error transition-colors self-start"
              aria-label="Quitar de la lista"
            >
              <Heart size={16} strokeWidth={1.5} className="fill-primary text-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
