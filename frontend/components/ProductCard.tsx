"use client";

import { Producto } from "@/types/producto";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductCard({ producto }: { producto: Producto }) {
  const { addToCart } = useCart();

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

        {/* BADGE */}
        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
          Nuevo
        </span>
      </div>

      {/* CONTENIDO */}
      <div className="p-4">

        <h2 className="font-semibold text-lg line-clamp-1">
          {producto.nombre}
        </h2>

        <p className="text-gray-500 text-sm line-clamp-2 mt-1">
          {producto.descripcion}
        </p>

        {/* PRECIO */}
        <div className="flex justify-between items-center mt-4">

          <span className="text-primary font-bold text-lg">
            {formatPrice(producto.precio)}
          </span>

          {/* BOTÓN */}
          <button
            onClick={() => addToCart(producto)}
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:scale-105 transition"
          >
            🛒
          </button>

        </div>
      </div>

    </div>
  );
}