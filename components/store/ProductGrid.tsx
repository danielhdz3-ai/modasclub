import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types/database";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  showMemberPrice?: boolean;
}

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function ProductGrid({ products, loading, columns = 4, showMemberPrice }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-5`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <p className="font-[family-name:var(--font-cormorant)] italic text-2xl text-text-muted mb-2">
          No se encontraron productos
        </p>
        <p className="text-[13px] text-text-muted font-light">
          Prueba a cambiar los filtros o busca algo diferente.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showMemberPrice={showMemberPrice} />
      ))}
    </div>
  );
}
