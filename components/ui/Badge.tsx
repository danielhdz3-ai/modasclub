import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale" | "out" | "member" | "ai";
  className?: string;
}

const variantStyles = {
  new: "bg-primary-light text-primary-hover",
  sale: "bg-gold/20 text-gold",
  out: "bg-nude-light text-nude",
  member: "bg-gold/20 text-gold",
  ai: "bg-surface-2 text-text-secondary border border-border",
};

export function Badge({ children, variant = "new", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
