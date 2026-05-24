"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  toast,
} from "sonner";

import {
  Producto,
} from "@/types/producto";

import {
  useAuth,
} from "@/context/AuthContext";

// =====================================
// ITEM CARRITO
// =====================================

interface CartItem
  extends Producto {

  cantidad: number;
}

// =====================================
// CONTEXTO
// =====================================

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

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);

// =====================================
// PROVIDER
// =====================================

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    token,
    usuario,
  } = useAuth();

  const [cart,
    setCart] =
      useState<CartItem[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  // =====================================
  // CARGAR CARRITO
  // =====================================

  useEffect(() => {

    const cargarCarrito =
      async () => {

        // =====================================
        // USUARIO LOGUEADO
        // =====================================

        if (token) {

          try {

            const response =
              await axios.get(
                `${API_URL}/carrito`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

            setCart(
              response.data
            );

          } catch (error) {

            console.error(error);

            toast.error(
              "Error cargando carrito"
            );
          }

        } else {

          // =====================================
          // LOCAL STORAGE
          // =====================================

          const storedCart =
            localStorage.getItem(
              "cart"
            );

          setCart(
            storedCart
              ? JSON.parse(
                  storedCart
                )
              : []
          );
        }
      };

    cargarCarrito();

  }, [token, API_URL]);

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

  const addToCart =
    async (
      producto: Producto
    ) => {

      // =====================================
      // STOCK
      // =====================================

      if (
        producto.stock <= 0
      ) {

        toast.error(
          "Producto agotado"
        );

        return;
      }

      // =====================================
      // VALIDAR LIMITE
      // =====================================

      const existente =
        cart.find(
          (item) =>
            item.id_producto ===
            producto.id_producto
        );

      if (
        existente &&
        existente.cantidad >=
        producto.stock
      ) {

        toast.warning(
          "No hay más stock disponible"
        );

        return;
      }

      // =====================================
      // USUARIO LOGUEADO
      // =====================================

      if (token) {

        try {

          await axios.post(
            `${API_URL}/carrito`,
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

            // YA EXISTE
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

            // NUEVO
            return [
              ...prev,
              {
                ...producto,
                cantidad: 1,
              },
            ];
          });

          toast.success(
            `${producto.nombre} agregado al carrito`
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error agregando producto"
          );
        }

      } else {

        // =====================================
        // LOCAL STORAGE
        // =====================================

        setCart((prev) => {

          const existe =
            prev.find(
              (item) =>
                item.id_producto ===
                producto.id_producto
            );

          // YA EXISTE
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

          // NUEVO
          return [
            ...prev,
            {
              ...producto,
              cantidad: 1,
            },
          ];
        });

        toast.success(
          `${producto.nombre} agregado al carrito`
        );
      }
    };

  // =====================================
  // ELIMINAR PRODUCTO
  // =====================================

  const removeFromCart =
    async (
      id: number
    ) => {

      // =====================================
      // BACKEND
      // =====================================

      if (token) {

        try {

          await axios.delete(
            `${API_URL}/carrito/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error eliminando producto"
          );

          return;
        }
      }

      // =====================================
      // FRONT
      // =====================================

      setCart((prev) =>
        prev.filter(
          (item) =>
            item.id_producto !== id
        )
      );

      toast.success(
        "Producto eliminado"
      );
    };

  // =====================================
  // AUMENTAR CANTIDAD
  // =====================================

  const increaseQuantity =
    async (
      id: number
    ) => {

      const producto =
        cart.find(
          (item) =>
            item.id_producto === id
        );

      if (!producto) return;

      await addToCart(
        producto
      );
    };

  // =====================================
  // DISMINUIR CANTIDAD
  // =====================================

  const decreaseQuantity =
    async (
      id: number
    ) => {

      const item =
        cart.find(
          (item) =>
            item.id_producto === id
        );

      if (!item) return;

      // =====================================
      // SI SOLO HAY 1
      // =====================================

      if (
        item.cantidad === 1
      ) {

        await removeFromCart(id);

        return;
      }

      // =====================================
      // FRONT
      // =====================================

      setCart((prev) =>

        prev.map((item) =>

          item.id_producto === id
            ? {
                ...item,
                cantidad:
                  item.cantidad - 1,
              }
            : item
        )
      );
    };

  // =====================================
  // VACIAR CARRITO
  // =====================================

  const clearCart =
    async () => {

      if (token) {

        try {

          await axios.delete(
            `${API_URL}/carrito`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error vaciando carrito"
          );

          return;
        }
      }

      setCart([]);

      toast.success(
        "Carrito vaciado"
      );
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

// =====================================
// HOOK
// =====================================

export function useCart() {

  const context =
    useContext(
      CartContext
    );

  if (!context) {

    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}