"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Producto } from "@/types/producto";

import { useAuth } from "@/context/AuthContext";

// 🧩 ITEM CARRITO
interface CartItem extends Producto {
  cantidad: number;
}

// 🧠 CONTEXTO
interface CartContextType {
  cart: CartItem[];

  addToCart: (
    producto: Producto
  ) => Promise<void>;

  removeFromCart: (
    id: number
  ) => Promise<void>;

  increaseQuantity: (
    id: number
  ) => Promise<void>;

  decreaseQuantity: (
    id: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

// 🚀 PROVIDER
export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { token, usuario } =
    useAuth();

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const API_URL =
    `${process.env.NEXT_PUBLIC_API_URL}/carrito`;

  // =====================================
  // CARGAR CARRITO
  // =====================================
  useEffect(() => {

    const cargarCarrito =
      async () => {

        // USUARIO LOGUEADO
        if (token) {
          try {

            const response =
              await axios.get(
                API_URL,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

            setCart(response.data);

          } catch (error) {
            console.error(error);
          }

        } else {

          // LOCALSTORAGE
          const storedCart =
            localStorage.getItem(
              "cart"
            );

          setCart(
            storedCart
              ? JSON.parse(storedCart)
              : []
          );
        }
      };

    cargarCarrito();

  }, [token]);

  // =====================================
  // GUARDAR LOCAL
  // =====================================
  useEffect(() => {

    if (!usuario) {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    }

  }, [cart, usuario]);

  // =====================================
  // AGREGAR PRODUCTO
  // =====================================
  const addToCart = async (
    producto: Producto
  ) => {

    // USUARIO LOGUEADO
    if (token) {

      try {

        await axios.post(
          API_URL,
          {
            id_producto:
              producto.id_producto,

            cantidad: 1,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCart((prev) => {

          const existe =
            prev.find(
              (item) =>
                item.id_producto ===
                producto.id_producto
            );

          if (existe) {

            return prev.map(
              (item) =>
                item.id_producto ===
                producto.id_producto
                  ? {
                      ...item,
                      cantidad:
                        item.cantidad + 1,
                    }
                  : item
            );
          }

          return [
            ...prev,
            {
              ...producto,
              cantidad: 1,
            },
          ];
        });

      } catch (error) {
        console.error(error);
      }

    } else {

      // LOCAL
      setCart((prev) => {

        const existe =
          prev.find(
            (item) =>
              item.id_producto ===
              producto.id_producto
          );

        if (existe) {

          return prev.map(
            (item) =>
              item.id_producto ===
              producto.id_producto
                ? {
                    ...item,
                    cantidad:
                      item.cantidad + 1,
                  }
                : item
          );
        }

        return [
          ...prev,
          {
            ...producto,
            cantidad: 1,
          },
        ];
      });
    }
  };

  // =====================================
  // ELIMINAR PRODUCTO
  // =====================================
  const removeFromCart = async (
    id: number
  ) => {

    // BACKEND
    if (token) {

      try {

        await axios.delete(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } catch (error) {
        console.error(error);
      }
    }

    // FRONT
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.id_producto !== id
      )
    );
  };

  // =====================================
  // AUMENTAR
  // =====================================
  const increaseQuantity =
    async (id: number) => {

      const producto =
        cart.find(
          (item) =>
            item.id_producto === id
        );

      if (!producto) return;

      await addToCart(producto);
    };

  // =====================================
  // DISMINUIR
  // =====================================
  const decreaseQuantity =
    async (id: number) => {

      setCart((prev) =>
        prev
          .map((item) =>
            item.id_producto === id
              ? {
                  ...item,
                  cantidad:
                    item.cantidad - 1,
                }
              : item
          )
          .filter(
            (item) =>
              item.cantidad > 0
          )
      );
    };

  // =====================================
  // VACIAR
  // =====================================
  const clearCart =
    async () => {

      if (token) {

        try {

          await axios.delete(
            API_URL,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        } catch (error) {
          console.error(error);
        }
      }

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

// 🪝 HOOK
export function useCart() {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}