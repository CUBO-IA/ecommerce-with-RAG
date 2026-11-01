"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type CartProduct = { id: number; name: string; priceCents: number; imageUrl: string };
export type CartItem = CartProduct & { quantity: number };

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; product: CartProduct }
  | { type: "setQuantity"; id: number; quantity: number }
  | { type: "remove"; id: number }
  | { type: "clear" };

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  totalCents: number;
  add: (product: CartProduct) => void;
  setQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "cart";

const CartContext = createContext<CartContextValue | null>(null);

type State = { items: CartItem[]; ready: boolean };

function reducer({ items, ready }: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, ready: true };
    case "add": {
      const exists = items.some((i) => i.id === action.product.id);
      if (!exists) return { items: [...items, { ...action.product, quantity: 1 }], ready };
      return { items: items.map((i) => (i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i)), ready };
    }
    case "setQuantity":
      if (action.quantity < 1) return { items: items.filter((i) => i.id !== action.id), ready };
      return { items: items.map((i) => (i.id === action.id ? { ...i, quantity: action.quantity } : i)), ready };
    case "remove":
      return { items: items.filter((i) => i.id !== action.id), ready };
    case "clear":
      return { items: [], ready };
  }
}

// ponytail: sin validación de esquema; el precio guardado es un snapshot y el checkout debería revalidarlo contra el servidor.
export function readStorage(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((i) => typeof i?.id === "number" && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [{ items, ready }, dispatch] = useReducer(reducer, { items: [], ready: false });

  useEffect(() => {
    dispatch({ type: "hydrate", items: readStorage() });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    ready,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    totalCents: items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    add: (product) => dispatch({ type: "add", product }),
    setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
    remove: (id) => dispatch({ type: "remove", id }),
    clear: () => dispatch({ type: "clear" }),
  }), [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
