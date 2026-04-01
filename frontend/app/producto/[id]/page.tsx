"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Producto } from "@/types/producto";
import { useParams } from "next/navigation";

export default function ProductoPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const formatPrice = (price: number) =>
    price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });

  if (loading) {
    return <p className="text-center mt-10">Cargando producto...</p>;
  }

  if (!producto) {
    return <p className="text-center mt-10">Producto no encontrado</p>;
  }

  return (
    <main className="px-6 md:px-10 py-12 max-w-6xl mx-auto">

      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* IMAGEN */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-[450px] object-cover rounded-xl"
          />
        </div>

        {/* INFO */}
        <div>

          <h1 className="text-3xl font-bold text-primary">
            {producto.nombre}
          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed">
            {producto.descripcion}
          </p>

          {/* PRECIO */}
          <p className="text-3xl font-bold text-primary mt-6">
            {formatPrice(producto.precio)}
          </p>

          {/* STOCK */}
          <p className="text-sm text-gray-500 mt-2">
            {producto.stock > 0
              ? `Stock disponible: ${producto.stock}`
              : "Agotado"}
          </p>

          {/* BOTÓN */}
          <button
            onClick={() => addToCart(producto)}
            disabled={producto.stock === 0}
            className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition ${
              producto.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover-scale"
            }`}
          >
            {producto.stock === 0
              ? "Producto agotado"
              : "Agregar al carrito 🛒"}
          </button>

          {/* INFO EXTRA */}
          <div className="mt-8 border-t pt-6 space-y-2 text-sm text-gray-600">
            <p>✔ Envíos a todo el país</p>
            <p>✔ Garantía de calidad</p>
            <p>✔ Pago seguro</p>
          </div>

        </div>

      </div>

    </main>
  );
}