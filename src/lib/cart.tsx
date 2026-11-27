"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MAX_QUANTITY, PRODUCT } from "./product";
import { isSaleOn, salePricing, type Pricing } from "./sale";
import { useSaleLive } from "./useSaleLive";

const STORAGE_KEY = "mimi-crack.cart.v1";

type CartState = {
  /** Jars in the cart. The store sells exactly one SKU. */
  quantity: number;
  /** False until the persisted cart has been read, so SSR and the first
   *  client render agree and React doesn't throw a hydration mismatch. */
  ready: boolean;
  add: (n?: number) => void;
  setQuantity: (n: number) => void;
  remove: () => void;
  /** What the jars cost, sale applied. */
  subtotalCents: number;
  /** The same jars at the everyday price, and the difference. */
  pricing: Pricing;
  justAdded: boolean;
};

const CartContext = createContext<CartState | null>(null);

const clamp = (n: number) =>
  Math.max(0, Math.min(MAX_QUANTITY, Math.floor(Number.isFinite(n) ? n : 0)));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantity, setQuantityState] = useState(0);
  const [ready, setReady] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // The cart renders nothing until the persisted quantity has been read, so
  // this is only ever consulted after mount — no server render depends on it.
  const saleOn = useSaleLive(isSaleOn());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setQuantityState(clamp(JSON.parse(raw)?.quantity));
    } catch {
      // Private mode, blocked storage, corrupted value — an empty cart is a
      // perfectly good fallback, so there is nothing to report.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantity }));
    } catch {
      // Non-fatal: the cart still works for this page view.
    }
  }, [quantity, ready]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2200);
    return () => clearTimeout(t);
  }, [justAdded]);

  const setQuantity = useCallback((n: number) => setQuantityState(clamp(n)), []);

  const add = useCallback((n = 1) => {
    setQuantityState((q) => clamp(q + n));
    setJustAdded(true);
  }, []);

  const remove = useCallback(() => setQuantityState(0), []);

  const pricing = useMemo(
    () => salePricing(quantity, PRODUCT.priceCents, saleOn),
    [quantity, saleOn],
  );

  const value = useMemo<CartState>(
    () => ({
      quantity,
      ready,
      add,
      setQuantity,
      remove,
      subtotalCents: pricing.totalCents,
      pricing,
      justAdded,
    }),
    [quantity, ready, add, setQuantity, remove, pricing, justAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
