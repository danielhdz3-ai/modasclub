"use client";

import { useUIStore } from "@/store/uiStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-l-success text-success",
  error: "border-l-error text-error",
  info: "border-l-primary text-primary",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 bg-white rounded-card p-4 shadow-card border-l-4 animate-fade-in-up",
              colors[toast.type]
            )}
            role="alert"
          >
            <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <p className="text-[13px] text-text flex-1 font-light">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
