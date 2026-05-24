"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Producto,
} from "@/types/producto";

import {
  useAuth,
} from "@/context/AuthContext";

// =====================================
// TYPES
// =====================================

interface FavoritesContextType {

  favoritos: Producto[];

  addFavorito: (
    producto: Producto
  ) => Promise<void>;

  removeFavorito: (
    id_producto: number
  ) => Promise<void>;

  isFavorito: (
    id_producto: number
  ) => boolean;
}

// =====================================
// CONTEXT
// =====================================

const FavoritesContext =
  createContext<
    FavoritesContextType | undefined
  >(undefined);

// =====================================
// PROVIDER
// =====================================

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    token,
  } = useAuth();

  const [favoritos,
    setFavoritos] =
      useState<Producto[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  // =====================================
  // CARGAR FAVORITOS
  // =====================================

  useEffect(() => {

    const cargarFavoritos =
      async () => {

        // =====================================
        // NO LOGIN
        // =====================================

        if (!token) {

          setFavoritos([]);

          return;
        }

        try {

          const response =
            await axios.get(
              `${API_URL}/favoritos`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setFavoritos(
            response.data
          );

        } catch (error) {

          console.error(error);
        }
      };

    cargarFavoritos();

  }, [token, API_URL]);

  // =====================================
  // AGREGAR FAVORITO
  // =====================================

  const addFavorito =
    async (
      producto: Producto
    ) => {

      if (!token) return;

      // =====================================
      // EVITAR DUPLICADOS
      // =====================================

      const yaExiste =
        favoritos.some(
          (item) =>
            item.id_producto ===
            producto.id_producto
        );

      if (yaExiste) return;

      try {

        await axios.post(
          `${API_URL}/favoritos`,
          {
            id_producto:
              producto.id_producto,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setFavoritos((prev) => [

          producto,
          ...prev,
        ]);

      } catch (error) {

        console.error(error);
      }
    };

  // =====================================
  // ELIMINAR FAVORITO
  // =====================================

  const removeFavorito =
    async (
      id_producto: number
    ) => {

      if (!token) return;

      try {

        await axios.delete(
          `${API_URL}/favoritos/${id_producto}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setFavoritos((prev) =>

          prev.filter(
            (item) =>
              item.id_producto !==
              id_producto
          )
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =====================================
  // VALIDAR FAVORITO
  // =====================================

  const isFavorito =
    (
      id_producto: number
    ) => {

      return favoritos.some(
        (item) =>
          item.id_producto ===
          id_producto
      );
    };

  return (

    <FavoritesContext.Provider
      value={{
        favoritos,
        addFavorito,
        removeFavorito,
        isFavorito,
      }}
    >

      {children}

    </FavoritesContext.Provider>
  );
}

// =====================================
// HOOK
// =====================================

export function useFavorites() {

  const context =
    useContext(
      FavoritesContext
    );

  if (!context) {

    throw new Error(
      "useFavorites debe usarse dentro de FavoritesProvider"
    );
  }

  return context;
}