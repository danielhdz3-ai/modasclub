import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium uppercase tracking-wider text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full border border-border rounded-lg px-4 py-3 text-[14px] font-light text-text placeholder:text-text-muted bg-surface-2 focus:outline-none focus:border-primary focus:shadow-input transition-all duration-200",
            error && "border-error focus:border-error focus:shadow-none",
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-error">{error}</p>}
        {hint && !error && <p className="text-[12px] text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
