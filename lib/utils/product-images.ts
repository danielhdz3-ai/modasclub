import type { Product, ProductImage } from "@/types/database";

/** Imágenes para UI: usa `images` si existen; si no, `primary_image_url` de Supabase. */
export function getProductImages(product: Product): ProductImage[] {
  const existing = product.images?.filter(Boolean) ?? [];
  if (existing.length > 0) return existing;

  const url = product.primary_image_url;
  if (url) {
    return [
      {
        url: encodeUnsplashUrl(url),
        alt: product.name,
        is_primary: true,
        source: "manual",
      },
    ];
  }
  return [];
}

/** Evita cortes agresivos de Unsplash que a veces 404 en edge/CDN. */
function encodeUnsplashUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("unsplash.com")) {
      if (!u.searchParams.has("auto")) u.searchParams.set("auto", "format");
      if (!u.searchParams.has("w")) u.searchParams.set("w", "1200");
      if (!u.searchParams.has("q")) u.searchParams.set("q", "85");
    }
    return u.toString();
  } catch {
    return url;
  }
}
