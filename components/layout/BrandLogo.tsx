import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const MARK_SRC =
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=128&q=80";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const textSize = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const markSize = {
  sm: 32,
  md: 36,
  lg: 44,
};

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const wh = markSize[size];
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group", className)}
    >
      <span className="relative shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-primary/25 transition-transform duration-300 group-hover:scale-[1.03] group-hover:ring-primary/45">
        <img
          src={MARK_SRC}
          alt=""
          width={wh}
          height={wh}
          className="object-cover"
          style={{ width: wh, height: wh }}
          loading="eager"
          decoding="async"
        />
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-cormorant)] italic font-light tracking-wide text-primary-hover",
          textSize[size]
        )}
      >
        ModasClub
      </span>
    </Link>
  );
}
