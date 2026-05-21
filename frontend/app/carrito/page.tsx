"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CarritoPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-primary mb-8">
        Tu carrito 🛒
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Tu carrito está vacío
          </p>

          <Link href="/productos">
            <button className="bg-primary text-white px-6 py-2 rounded-xl">
              Ir a comprar
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* LISTA */}
          <div className="space-y-6">

            {cart.map((item) => (
              <div
                key={item.id_producto}
                className="flex gap-4 items-center bg-white shadow-md p-4 rounded-xl"
              >

                {/* IMAGEN */}
                <Image
                  src={item.imagen_url}
                  alt={item.nombre}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold">
                    {item.nombre}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    ${item.precio}
                  </p>

                  <p className="text-sm">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                {/* TOTAL ITEM */}
                <div className="font-bold text-primary">
                  ${item.precio * item.cantidad}
                </div>

                {/* ELIMINAR */}
                <button
                  onClick={() => removeFromCart(item.id_producto)}
                  className="text-red-500 hover:scale-110"
                >
                  ❌
                </button>

              </div>
            ))}

          </div>

          {/* TOTAL */}
          <div className="mt-10 flex justify-between items-center border-t pt-6">

            <h2 className="text-2xl font-bold">
              Total:
            </h2>

            <span className="text-2xl font-bold text-primary">
              ${total}
            </span>

          </div>

          {/* BOTÓN */}
          <div className="mt-6 text-right">

            <Link href="/checkout">

              <button className="bg-primary text-white px-6 py-3 rounded-xl hover-scale">
                Finalizar compra
              </button>

            </Link>

          </div>
        </>
      )}

    </main>
  );
}