"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { ProductImage } from "@/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-surface-2 rounded-card flex items-center justify-center">
        <span className="font-[family-name:var(--font-cormorant)] italic text-5xl text-primary-light">
          {productName[0]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                i === selected ? "border-primary" : "border-border hover:border-primary-light"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative flex-1 aspect-[3/4] rounded-card overflow-hidden bg-surface-2 cursor-zoom-in"
        onClick={() => setZoom(true)}
      >
        <Image
          src={images[selected].url}
          alt={images[selected].alt ?? productName}
          fill
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Zoom modal */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoom(false)}
        >
          <div className="relative max-w-3xl w-full aspect-[3/4]">
            <Image
              src={images[selected].url}
              alt={images[selected].alt ?? productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
