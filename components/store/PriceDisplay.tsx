import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatters";

interface PriceDisplayProps {
  price: number;
  memberPrice?: number | null;
  compareAtPrice?: number | null;
  isMember?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  price,
  memberPrice,
  compareAtPrice,
  isMember = false,
  size = "md",
  className,
}: PriceDisplayProps) {
  const displayPrice = isMember && memberPrice ? memberPrice : price;

  const textSizes = {
    sm: "text-base",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-text-muted line-through text-sm">
          {formatPrice(compareAtPrice)}
        </span>
      )}

      <span className={cn(
        "font-[family-name:var(--font-cormorant)] italic text-text",
        textSizes[size]
      )}>
        {formatPrice(displayPrice)}
      </span>

      {!isMember && memberPrice && memberPrice < price && (
        <span className="text-[12px] text-gold font-medium bg-gold/10 px-2 py-0.5 rounded-full">
          ✦ {formatPrice(memberPrice)} socia
        </span>
      )}

      {isMember && memberPrice && (
        <span className="text-[11px] text-gold uppercase tracking-wider">
          Precio Club
        </span>
      )}
    </div>
  );
}
