// src/context/CartContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types/Product";
import type { CartItem } from "../types/Cart";

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (codigo: number | string) => void;
  setQty: (codigo: number | string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (p: Product, qty = 1) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) => String(i.product.codigo) === String(p.codigo));
      if (idx >= 0) {
        const copy = [...cur];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [{ product: p, qty }, ...cur];
    });
  };

  const remove = (codigo: number | string) => {
    setItems((cur) => cur.filter((i) => String(i.product.codigo) !== String(codigo)));
  };

  const setQty = (codigo: number | string, qty: number) => {
    setItems((cur) =>
      cur.map((i) => (String(i.product.codigo) === String(codigo) ? { ...i, qty: Math.max(0, qty) } : i))
    );
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.product.precio * it.qty, 0), [items]);
  const totalItems = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
