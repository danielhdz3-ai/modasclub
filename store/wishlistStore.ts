"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistStoreItem } from "@/types/store";

interface WishlistState {
  items: WishlistStoreItem[];
  addItem: (item: WishlistStoreItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistStoreItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.product_id === item.product_id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(item.product_id)) {
          removeItem(item.product_id);
        } else {
          addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.product_id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "modasclub-wishlist",
      skipHydration: true,
    }
  )
);
