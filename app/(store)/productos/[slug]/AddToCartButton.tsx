"use client";

import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import type { Product } from "@/types/database";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock_status === "out_of_stock";
  const images = product.images ?? [];
  const primaryImage = images.find((i) => i.is_primary) ?? images[0];

  const handleAddToCart = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    addToast({ message: `${product.name} añadido al carrito`, type: "success" });
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="primary"
        size="lg"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="flex-1"
      >
        <ShoppingBag size={16} strokeWidth={1.5} />
        {isOutOfStock ? "Agotado" : added ? "¡Añadido!" : "Añadir al carrito"}
      </Button>

      <button
        onClick={() => toggleItem({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: primaryImage?.url ?? null,
          slug: product.slug,
        })}
        className="btn-outline px-4"
        aria-label={inWishlist ? "Quitar de wishlist" : "Añadir a wishlist"}
      >
        <Heart
          size={18}
          strokeWidth={1.5}
          className={inWishlist ? "fill-primary text-primary" : ""}
        />
      </button>
    </div>
  );
}
