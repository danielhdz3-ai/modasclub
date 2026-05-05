"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/layout/BrandLogo";

const NAV_LINKS = [
  { label: "Bolsos", href: "/categoria/bolsos" },
  { label: "Perfumes", href: "/categoria/perfumes" },
  { label: "Relojes", href: "/categoria/relojes" },
  { label: "Novedades", href: "/productos?sort=newest" },
  { label: "El Club", href: "/club" },
  { label: "Sobre nosotras", href: "/sobre-nosotras" },
  { label: "Contacto", href: "/contacto" },
];

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();

  useEffect(() => {
    if (isMobileNavOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileNavOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isMobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileNav}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-lg transition-transform duration-300 ease-out flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <BrandLogo size="sm" />
          <button onClick={closeMobileNav} aria-label="Cerrar menú">
            <X size={20} strokeWidth={1.5} className="text-text-secondary" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-5">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className="block py-3 px-2 text-[13px] uppercase tracking-[0.1em] font-light text-text-secondary hover:text-primary border-b border-border/50 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-5 border-t border-border">
          <Link
            href="/login"
            onClick={closeMobileNav}
            className="btn-primary w-full"
          >
            Mi cuenta
          </Link>
        </div>
      </div>
    </>
  );
}
