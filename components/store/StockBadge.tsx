import { cn } from "@/lib/utils/cn";
import type { StockStatus } from "@/types/database";

const LABELS: Record<StockStatus, string> = {
  in_stock: "En stock",
  low_stock: "Últimas unidades",
  out_of_stock: "Agotado",
  discontinued: "Descatalogado",
};

const STYLES: Record<StockStatus, string> = {
  in_stock: "text-success",
  low_stock: "text-gold",
  out_of_stock: "text-error",
  discontinued: "text-text-muted",
};

interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
  className?: string;
}

export function StockBadge({ status, quantity, className }: StockBadgeProps) {
  const showQuantity = status === "low_stock" && quantity !== undefined && quantity > 0;

  return (
    <span className={cn("flex items-center gap-1.5 text-[12px] font-medium", STYLES[status], className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "in_stock" ? "bg-success" :
        status === "low_stock" ? "bg-gold" :
        status === "out_of_stock" ? "bg-error" : "bg-text-muted"
      )} />
      {LABELS[status]}
      {showQuantity && ` — quedan ${quantity}`}
    </span>
  );
}
