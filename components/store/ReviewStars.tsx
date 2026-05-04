import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReviewStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function ReviewStars({
  rating,
  maxRating = 5,
  size = 14,
  showCount,
  count,
  className,
}: ReviewStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.5}
            className={cn(
              i < Math.round(rating)
                ? "fill-gold text-gold"
                : "fill-transparent text-nude"
            )}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-[12px] text-text-muted">({count ?? 0})</span>
      )}
    </div>
  );
}
