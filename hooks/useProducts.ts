"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";
import type { FilterState } from "@/types/store";

interface UseProductsOptions extends FilterState {
  limit?: number;
  page?: number;
  featured?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const limit = options.limit ?? 12;
  const page = options.page ?? 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("products")
      .select("*, category:categories(id,name,slug)", { count: "exact" })
      .eq("is_active", true);

    if (options.featured) query = query.eq("is_featured", true);
    if (options.category) query = query.eq("categories.slug", options.category);
    if (options.brand) query = query.ilike("brand", `%${options.brand}%`);
    if (options.gender) query = query.eq("gender", options.gender);
    if (options.inStock) query = query.gt("stock_quantity", 0);
    if (options.minPrice !== undefined) query = query.gte("price", options.minPrice);
    if (options.maxPrice !== undefined) query = query.lte("price", options.maxPrice);
    if (options.search) query = query.ilike("name", `%${options.search}%`);

    switch (options.sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (error) {
      setError(error.message);
    } else {
      setProducts(data as Product[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [options.featured, options.category, options.brand, options.gender, options.inStock, options.minPrice, options.maxPrice, options.search, options.sort, page, limit, supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, loading, error, refetch: fetchProducts };
}
