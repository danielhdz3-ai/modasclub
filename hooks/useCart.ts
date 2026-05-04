"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export function useCart() {
  const store = useCartStore();

  // Rehydrate persisted cart
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return store;
}
