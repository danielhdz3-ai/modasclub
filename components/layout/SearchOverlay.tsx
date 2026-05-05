"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils/cn";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQ("");
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const submit = () => {
    const term = q.trim();
    closeSearch();
    if (term) router.push(`/productos?q=${encodeURIComponent(term)}`);
    else router.push("/productos");
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Cerrar búsqueda"
        onClick={closeSearch}
      />
      <div className="relative bg-white border-b border-border shadow-lg p-4 md:p-6">
        <div className="content-max flex items-center gap-3">
          <Search size={22} strokeWidth={1.5} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") closeSearch();
            }}
            placeholder="Buscar bolsos, perfumes, relojes…"
            className={cn(
              "flex-1 bg-transparent text-[16px] md:text-[18px] outline-none font-light",
              "placeholder:text-text-muted"
            )}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-surface-2"
            aria-label="Cerrar"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <div className="content-max mt-4 flex justify-end gap-2">
          <button type="button" onClick={closeSearch} className="btn-ghost text-[13px]">
            Cancelar
          </button>
          <button type="button" onClick={submit} className="btn-primary text-[13px]">
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
