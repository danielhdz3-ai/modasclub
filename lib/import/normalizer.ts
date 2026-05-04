import { slugify, generateProductSlug, calculatePrices, parsePrice } from "@/lib/utils/formatters";
import { productRowSchema } from "./validators";
import type { ImportResult } from "@/types/api";
import type { ProductImage } from "@/types/database";

interface NormalizedProduct {
  supplier_id: string;
  supplier_sku: string | null;
  name: string;
  slug: string;
  sku: string;
  brand: string | null;
  description: string | null;
  cost_price: number | null;
  price: number;
  member_price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  images: ProductImage[];
  gender: string | null;
  weight_grams: number | null;
  is_active: boolean;
  ai_enhanced: boolean;
  attributes: Record<string, string | number | boolean>;
}

interface NormalizerOptions {
  supplierId: string;
  categoryId?: string;
}

export function normalizeProductRows(
  rows: Record<string, string>[],
  options: NormalizerOptions
): { products: NormalizedProduct[]; result: Omit<ImportResult, "created" | "updated"> } {
  const products: NormalizedProduct[] = [];
  const errors: ImportResult["errors"] = [];
  let skipped = 0;

  rows.forEach((row, index) => {
    const parsed = productRowSchema.safeParse({
      name: row["name"] ?? row["nombre"] ?? "",
      supplier_sku: row["supplier_sku"] ?? row["sku"] ?? row["referencia"] ?? undefined,
      brand: row["brand"] ?? row["marca"] ?? undefined,
      description: row["description"] ?? row["descripcion"] ?? row["descripción"] ?? undefined,
      cost_price: row["cost_price"] ?? row["precio_coste"] ?? row["coste"] ?? undefined,
      price: row["price"] ?? row["precio"] ?? undefined,
      stock_quantity: row["stock_quantity"] ?? row["stock"] ?? row["cantidad"] ?? undefined,
      images: row["images"] ?? row["imagenes"] ?? row["imagen"] ?? undefined,
      category: row["category"] ?? row["categoria"] ?? undefined,
      gender: row["gender"] ?? row["genero"] ?? row["género"] ?? undefined,
      weight: row["weight"] ?? row["peso"] ?? undefined,
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      if (!row["name"] && !row["nombre"]) {
        skipped++;
        return; // Skip rows with no name silently
      }
      errors.push({
        row: index + 2, // +2 because rows are 0-indexed and header is row 1
        sku: row["supplier_sku"] ?? row["sku"] ?? `row-${index + 2}`,
        error: firstError?.message ?? "Error de validación",
      });
      return;
    }

    const data = parsed.data;
    const supplierSku = data.supplier_sku ?? null;
    const sku = supplierSku ?? `${options.supplierId.slice(0, 8)}-${index}`;
    const brand = data.brand ?? null;

    const costPrice = data.cost_price ?? null;
    let price = data.price ?? 0;
    let memberPrice: number | null = null;
    let compareAtPrice: number | null = null;

    if (costPrice && !price) {
      const calculated = calculatePrices(costPrice);
      price = calculated.price;
      memberPrice = calculated.member_price;
      compareAtPrice = calculated.compare_at_price;
    } else if (price && !memberPrice) {
      memberPrice = Math.round(price * 0.85); // 15% discount for members
    }

    const images: ProductImage[] = [];
    if (data.images) {
      const urls = data.images.split("|").map((u: string) => u.trim()).filter(Boolean);
      urls.forEach((url: string, i: number) => {
        images.push({
          url,
          alt: data.name,
          is_primary: i === 0,
          source: "supplier",
        });
      });
    }

    products.push({
      supplier_id: options.supplierId,
      supplier_sku: supplierSku,
      name: data.name,
      slug: generateProductSlug(data.name, brand ?? "mc", sku),
      sku,
      brand,
      description: data.description ?? null,
      cost_price: costPrice,
      price,
      member_price: memberPrice,
      compare_at_price: compareAtPrice,
      stock_quantity: data.stock_quantity ?? 0,
      images,
      gender: data.gender ?? null,
      weight_grams: data.weight ? Math.round(data.weight * 1000) : null,
      is_active: false, // Always inactive — requires manual review
      ai_enhanced: false,
      attributes: {},
    });
  });

  return {
    products,
    result: { total: rows.length, skipped, errors },
  };
}
