"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect } from "react";

export function useWishlist() {
  const store = useWishlistStore();

  useEffect(() => {
    useWishlistStore.persist.rehydrate();
  }, []);

  return store;
}
