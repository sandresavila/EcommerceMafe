"use client";

import Link from "next/link";

import Image from "next/image";

import {
  Heart,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  Producto,
} from "@/types/producto";

import {
  useCart,
} from "@/context/CartContext";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useFavorites,
} from "@/context/FavoritesContext";

export default function ProductCard({
  producto,
}: {
  producto: Producto;
}) {

  // =====================================
  // CONTEXTOS
  // =====================================

  const {
    addToCart,
  } = useCart();

  const {
    usuario,
  } = useAuth();

  const {
    addFavorito,
    removeFavorito,
    isFavorito,
  } = useFavorites();

  // =====================================
  // VALIDACION
  // =====================================

  if (
    !producto ||
    !producto.id_producto
  ) return null;

  // =====================================
  // FAVORITO
  // =====================================

  const liked =
    isFavorito(
      producto.id_producto
    );

  // =====================================
  // FORMATO PRECIO
  // =====================================

  const formatPrice =
    (price: number) =>

      price.toLocaleString(
        "es-CO",
        {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }
      );

  // =====================================
  // STOCK
  // =====================================

  const agotado =
    producto.stock <= 0;

  const pocasUnidades =
    producto.stock > 0 &&
    producto.stock <= 5;

  // =====================================
  // TOGGLE FAVORITO
  // =====================================

  const toggleFavorito =
    async () => {

      try {

        // LOGIN
        if (!usuario) {

          toast.error(
            "Debes iniciar sesión"
          );

          return;
        }

        // ELIMINAR
        if (liked) {

          await removeFavorito(
            producto.id_producto
          );

          toast.success(
            "Eliminado de favoritos"
          );

        } else {

          // AGREGAR
          await addFavorito(
            producto
          );

          toast.success(
            "Agregado a favoritos"
          );
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando favorito"
        );
      }
    };

  return (

    <div className="bg-white rounded-3xl shadow-md overflow-hidden group hover:shadow-2xl transition duration-300 border border-gray-100">

      {/* IMAGEN */}
      <div className="relative overflow-hidden">

        <Link
          href={`/producto/${producto.id_producto}`}
        >

          <Image
            src={
              producto.imagen_url ||
              "/placeholder.png"
            }
            alt={producto.nombre}
            width={500}
            height={500}
            className={`w-full h-64 object-cover transition duration-500
            ${
              agotado
                ? "grayscale"
                : "group-hover:scale-110"
            }`}
          />

        </Link>

        {/* BADGE STOCK */}
        <span
          className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg
          ${
            agotado
              ? "bg-gray-500"
              : pocasUnidades
              ? "bg-yellow-500"
              : "bg-primary"
          }`}
        >

          {agotado
            ? "Agotado"
            : pocasUnidades
            ? `Solo ${producto.stock}`
            : "Disponible"}

        </span>

        {/* FAVORITO */}
        <button
          onClick={toggleFavorito}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg backdrop-blur transition-all duration-300
          ${
            liked
              ? "bg-red-100 scale-110"
              : "bg-white/90 hover:scale-110"
          }`}
        >

          <Heart
            className={`w-5 h-5 transition
            ${
              liked
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />

        </button>

        {/* OVERLAY AGOTADO */}
        {agotado && (

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

            <span className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">

              Producto agotado

            </span>

          </div>
        )}

      </div>

      {/* CONTENIDO */}
      <div className="p-5">

        {/* NOMBRE */}
        <h2 className="font-bold text-lg line-clamp-1">

          {producto.nombre}

        </h2>

        {/* DESCRIPCION */}
        <p className="text-gray-500 text-sm line-clamp-2 mt-2 min-h-[40px]">

          {producto.descripcion}

        </p>

        {/* CATEGORIA */}
        {producto.categoria_nombre && (

          <div className="mt-3">

            <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">

              {producto.categoria_nombre}

            </span>

          </div>
        )}

        {/* STOCK */}
        <p className="text-xs text-gray-400 mt-3">

          Stock disponible:
          {" "}

          <span className="font-semibold">

            {producto.stock}

          </span>

        </p>

        {/* PRECIO + BTN */}
        <div className="flex justify-between items-center mt-5">

          {/* PRECIO */}
          <span className="text-primary font-bold text-xl">

            {formatPrice(
              Number(producto.precio)
            )}

          </span>

          {/* BTN */}
          <button
            onClick={() =>
              addToCart(producto)
            }
            disabled={agotado}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${
              agotado
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:scale-105 hover:shadow-lg"
            }`}
          >

            {agotado
              ? "Sin stock"
              : "🛒 Agregar"}

          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">

          <span>
            ✔ Original
          </span>

          <span>
            🚚 Envío nacional
          </span>

        </div>

      </div>

    </div>
  );
}