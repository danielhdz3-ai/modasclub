"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductGrid";
import { createClient } from "@/lib/supabase/client";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { Product } from "@/types/database";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "newest", label: "Más nuevos" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const sort = searchParams.get("sort") ?? "relevance";
  const search = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("products")
      .select("*, category:categories(id,name,slug)", { count: "exact" })
      .eq("is_active", true);

    if (search) query = query.ilike("name", `%${search}%`);

    switch (sort) {
      case "price_asc": query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "newest": query = query.order("created_at", { ascending: false }); break;
      default: query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (!error && data) {
      setProducts(data as Product[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [sort, search, page, limit]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete("page");
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <div className="section-padding">
      <div className="content-max">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text font-light">
              {search ? `Resultados: "${search}"` : "Toda la colección"}
            </h1>
            {!loading && (
              <p className="text-[13px] text-text-muted mt-1">
                {total} producto{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 btn-ghost text-[12px]"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filtros
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="appearance-none input-base pr-8 py-2 text-[12px] w-48"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search chip */}
        {search && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-[12px] text-text-muted">Buscando:</span>
            <span className="inline-flex items-center gap-1.5 bg-primary-pale text-primary text-[12px] px-3 py-1 rounded-full">
              {search}
              <button onClick={() => setParam("q", "")}>
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          </div>
        )}

        <ProductGrid products={products} loading={loading} columns={3} />

        {/* Pagination */}
        {total > limit && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
              <button
                key={i}
                onClick={() => setParam("page", String(i + 1))}
                className={`w-9 h-9 rounded-full text-[13px] transition-all ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "border border-border text-text-secondary hover:border-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
