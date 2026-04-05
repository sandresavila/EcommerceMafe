"use client";

import { Producto } from "@/types/producto";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ producto }: { producto: Producto }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);

  if (!producto || !producto.id_producto) return null;

  const formatPrice = (price: number) =>
    price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300">

      {/* IMAGEN */}
      <div className="relative overflow-hidden">

        <Link href={`/producto/${producto.id_producto}`}>
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-60 object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>

        {/* BADGE DINÁMICO */}
        <span
          className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
            producto.stock > 5
              ? "bg-primary"
              : producto.stock > 0
              ? "bg-yellow-500"
              : "bg-gray-400"
          }`}
        >
          {producto.stock > 5
            ? "Disponible"
            : producto.stock > 0
            ? "Pocas unidades"
            : "Agotado"}
        </span>

        {/* FAVORITO */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full hover:scale-110 transition"
        >
          {liked ? "❤️" : "🤍"}
        </button>

      </div>

      {/* CONTENIDO */}
      <div className="p-4">

        <h2 className="font-semibold text-lg line-clamp-1">
          {producto.nombre}
        </h2>

        <p className="text-gray-500 text-sm line-clamp-2 mt-1">
          {producto.descripcion}
        </p>

        {/* PRECIO + ACCIÓN */}
        <div className="flex justify-between items-center mt-4">

          <span className="text-primary font-bold text-lg">
            {formatPrice(producto.precio)}
          </span>

          <button
            onClick={() => addToCart(producto)}
            disabled={producto.stock === 0}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              producto.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:scale-105"
            }`}
          >
            🛒
          </button>

        </div>

        {/* MENSAJE DE CONFIANZA */}
        <p className="text-xs text-gray-400 mt-3">
          ✔ Producto original
        </p>

      </div>

    </div>
  );
}