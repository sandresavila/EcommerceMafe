"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Producto } from "@/types/producto";

// 🧩 ITEM DEL CARRITO
interface CartItem extends Producto {
  cantidad: number;
}

// 🧠 TIPADO DEL CONTEXTO
interface CartContextType {
  cart: CartItem[];
  addToCart: (producto: Producto) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 🚀 PROVIDER
export function CartProvider({ children }: { children: React.ReactNode }) {

  // 🔥 INICIALIZACIÓN DESDE LOCALSTORAGE (FORMA PRO)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 💾 GUARDAR EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ AGREGAR PRODUCTO
  const addToCart = (producto: Producto) => {
    setCart((prev) => {
      const existe = prev.find(
        (item) => item.id_producto === producto.id_producto
      );

      if (existe) {
        return prev.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // ❌ ELIMINAR PRODUCTO
  const removeFromCart = (id: number) => {
    setCart((prev) =>
      prev.filter((item) => item.id_producto !== id)
    );
  };

  // 🔼 AUMENTAR CANTIDAD
  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id_producto === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // 🔽 DISMINUIR CANTIDAD
  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id_producto === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0) // elimina si llega a 0
    );
  };

  // 🧹 VACIAR CARRITO
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 🪝 HOOK PERSONALIZADO
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}