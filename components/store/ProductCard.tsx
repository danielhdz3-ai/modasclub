"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductImages } from "@/lib/utils/product-images";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  showMemberPrice?: boolean;
}

export function ProductCard({ product, showMemberPrice = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  const images = getProductImages(product);
  const primaryImage = images.find((i) => i.is_primary) ?? images[0];
  const secondaryImage = images[1];

  const inWishlist = isInWishlist(product.id);
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isOutOfStock = product.stock_status === "out_of_stock";
  const isLowStock = product.stock_status === "low_stock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      product_id: product.id,
      variant_id: null,
      quantity: 1,
      name: product.name,
      price: product.price,
      member_price: product.member_price,
      image_url: primaryImage?.url ?? null,
      sku: product.sku,
      slug: product.slug,
      variant_name: null,
      stock_quantity: product.stock_quantity,
    });
    addToast({ message: `${product.name} añadido al carrito`, type: "success" });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: primaryImage?.url ?? null,
      slug: product.slug,
    });
  };

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group card-product block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        {primaryImage && !imgError ? (
          <Image
            src={hovered && secondaryImage ? secondaryImage.url : primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-2">
            <span className="font-[family-name:var(--font-cormorant)] text-3xl text-primary-light italic">
              {product.brand?.[0] ?? product.name[0]}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && <Badge variant="new">Nuevo</Badge>}
          {isOutOfStock && <Badge variant="out">Agotado</Badge>}
          {isLowStock && <Badge variant="sale">Últimas ud.</Badge>}
          {product.ai_enhanced && <Badge variant="ai">✦ IA</Badge>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200",
            "opacity-0 group-hover:opacity-100 hover:bg-white",
            inWishlist && "opacity-100"
          )}
          aria-label={inWishlist ? "Quitar de wishlist" : "Añadir a wishlist"}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={cn("transition-colors", inWishlist ? "fill-primary text-primary" : "text-text-secondary")}
          />
        </button>

        {/* Quick actions */}
        <div className={cn(
          "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
          "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        )}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 btn-primary py-2 text-[11px] disabled:opacity-50"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            Añadir
          </button>
          <Link
            href={`/productos/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="btn-outline py-2 px-3"
            aria-label="Ver producto"
          >
            <Eye size={13} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-light mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="text-[14px] text-text font-light leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-[13px] text-text-muted line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
          <span className="font-[family-name:var(--font-cormorant)] italic text-[18px] text-text">
            {formatPrice(product.price)}
          </span>
          {showMemberPrice && product.member_price && (
            <span className="text-[12px] text-gold font-medium">
              ✦ {formatPrice(product.member_price)} socia
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
