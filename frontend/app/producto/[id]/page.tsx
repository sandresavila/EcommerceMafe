"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Producto } from "@/types/producto";
import { useParams } from "next/navigation";
import Image from "next/image";

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
        <div className="bg-white rounded-2xl shadow-md p-4 relative">

          {/* BADGE */}
          {producto.stock > 0 && (
            <span className="absolute top-4 left-4 bg-gold text-dark px-3 py-1 rounded-full text-xs font-semibold">
              Disponible
            </span>
          )}

          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            width={900}
            height={900}
            className="w-full h-[450px] object-cover rounded-xl"          />
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

          {/* STOCK MEJORADO */}
          <p
            className={`text-sm mt-2 font-medium ${
              producto.stock > 5
                ? "text-green-600"
                : producto.stock > 0
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            {producto.stock > 5
              ? "En stock"
              : producto.stock > 0
              ? `¡Quedan pocas unidades! (${producto.stock})`
              : "Producto agotado"}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">

            <button
              onClick={() => addToCart(producto)}
              disabled={producto.stock === 0}
              className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
                producto.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover-scale"
              }`}
            >
              {producto.stock === 0
                ? "Producto agotado"
                : "Agregar al carrito 🛒"}
            </button>

            <button className="flex-1 border border-primary text-primary py-3 rounded-xl hover:bg-primary hover:text-white transition">
              ❤️ Guardar
            </button>

          </div>

          {/* ASESORÍA (CLAVE EN TU PROYECTO) */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border">

            <h3 className="font-semibold text-primary">
              ¿No sabes si este producto es para ti?
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Recibe asesoría personalizada y elige el producto ideal según tu tipo de piel o necesidad.
            </p>

            <button className="mt-4 bg-secondary text-white px-4 py-2 rounded-xl hover-scale text-sm">
              💬 Hablar con un asesor
            </button>

          </div>

          {/* INFO EXTRA */}
          <div className="mt-8 border-t pt-6 space-y-2 text-sm text-gray-600">
            <p>✔ Envíos a todo el país</p>
            <p>✔ Productos 100% originales</p>
            <p>✔ Pago seguro</p>
          </div>

        </div>

      </div>

    </main>
  );
}