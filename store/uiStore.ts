"use client";

import { create } from "zustand";

interface UIState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  toasts: Toast[];
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  toasts: [],

  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
