import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const MARK =
  "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=128&q=85&auto=format&fit=crop";

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
      <span className="relative rounded-full overflow-hidden ring-2 ring-primary/25 shadow-sm shrink-0 transition-transform duration-300 group-hover:ring-primary/45 group-hover:scale-[1.03]">
        <Image
          src={MARK}
          alt=""
          width={wh}
          height={wh}
          className="object-cover"
          sizes={`${wh}px`}
        />
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-cormorant)] italic text-primary-hover font-light tracking-wide",
          textSize[size]
        )}
      >
        ModasClub
      </span>
    </Link>
  );
}
