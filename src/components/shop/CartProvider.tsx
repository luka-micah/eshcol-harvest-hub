"use client";

import * as React from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  unit: string;
  image: string | null;
  quantity: number;
  maxQuantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  loaded: boolean;
};

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "eshcol-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const addItem = React.useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.maxQuantity ?? i.quantity + item.quantity) }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i,
      ),
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count,
    subtotal,
    loaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
