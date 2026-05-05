"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Bolsos", href: "/categoria/bolsos" },
  { label: "Perfumes", href: "/categoria/perfumes" },
  { label: "Relojes", href: "/categoria/relojes" },
  { label: "Novedades", href: "/productos?sort=newest" },
  { label: "El Club", href: "/club" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCartDrawer = useCartStore((s) => s.openCart);
  const { openSearch, openMobileNav } = useUIStore();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-border transition-all duration-300",
        scrolled && "backdrop-blur-md bg-white/95 shadow-sm"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <BrandLogo size="md" />

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.12em] font-light text-text-secondary hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openSearch}
            aria-label="Buscar"
            className="p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          <Link
            href="/cuenta/wishlist"
            aria-label={`Wishlist (${wishlistCount} productos)`}
            className="relative p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => openCartDrawer()}
            aria-label={`Carrito (${totalItems} productos)`}
            className="relative p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          <Link
            href={user ? "/cuenta" : "/login"}
            aria-label="Mi cuenta"
            className="p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:flex text-[11px] uppercase tracking-wider text-text-muted hover:text-primary transition-colors ml-2"
            >
              Admin
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={openMobileNav}
            className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
            aria-label="Menú"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
