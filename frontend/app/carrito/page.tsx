"use client";

import Link from "next/link";

import Image from "next/image";

import {
  useCart,
} from "@/context/CartContext";

import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Minus,
  Plus,
} from "lucide-react";

export default function CarritoPage() {

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // =====================================
  // TOTAL
  // =====================================

  const total =
    cart.reduce(
      (acc, item) =>
        acc +
        item.precio *
        item.cantidad,
      0
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
        }
      );

  return (

    <main className="min-h-screen bg-[#F8F9FC] px-4 md:px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="text-center mb-14 fade-in">

          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold mb-6">

            <ShoppingCart className="w-5 h-5" />

            Tu carrito de compras

          </div>

          <h1 className="text-5xl md:text-6xl font-black text-dark">

            Carrito 🛒

          </h1>

          <p className="text-gray-500 text-lg mt-5 max-w-2xl mx-auto">

            Revisa tus productos y finaliza tu compra
            de forma rápida y segura.

          </p>

        </div>

        {/* ===================================== */}
        {/* EMPTY */}
        {/* ===================================== */}

        {cart.length === 0 ? (

          <div className="bg-white rounded-[2.5rem] shadow-xl p-12 md:p-20 text-center zoom-in">

            <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">

              <ShoppingCart className="w-14 h-14 text-primary" />

            </div>

            <h2 className="text-4xl font-black text-dark mb-5">

              Tu carrito está vacío

            </h2>

            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">

              Explora nuestros productos y descubre
              todo lo que tenemos para tu cuidado personal.

            </p>

            <Link href="/productos">

              <button className="bg-primary hover:scale-105 transition text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl">

                Explorar productos

              </button>

            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ===================================== */}
            {/* PRODUCTOS */}
            {/* ===================================== */}

            <section className="lg:col-span-2 space-y-6">

              {cart.map((item) => (

                <div
                  key={
                    item.id_producto
                  }
                  className="bg-white rounded-[2rem] shadow-lg p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-2xl transition"
                >

                  {/* IMAGE */}
                  <div className="relative overflow-hidden rounded-3xl">

                    <Image
                      src={
                        item.imagen_url
                      }
                      alt={
                        item.nombre
                      }
                      width={180}
                      height={180}
                      className="w-full md:w-40 h-40 object-cover rounded-3xl"
                    />

                  </div>

                  {/* INFO */}
                  <div className="flex-1 w-full">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-black text-dark">

                          {item.nombre}

                        </h2>

                        <p className="text-primary font-bold text-xl mt-2">

                          {formatPrice(
                            item.precio
                          )}

                        </p>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id_producto
                          )
                        }
                        className="text-red-500 hover:bg-red-50 transition p-3 rounded-xl self-start"
                      >

                        <Trash2 className="w-6 h-6" />

                      </button>

                    </div>

                    {/* QUANTITY */}
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                      {/* CONTROLS */}
                      <div className="flex items-center gap-4 bg-gray-100 rounded-2xl w-fit px-4 py-3">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id_producto
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition"
                        >

                          <Minus className="w-4 h-4" />

                        </button>

                        <span className="font-black text-lg min-w-[30px] text-center">

                          {item.cantidad}

                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id_producto
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-primary text-white shadow flex items-center justify-center hover:scale-105 transition"
                        >

                          <Plus className="w-4 h-4" />

                        </button>

                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-left sm:text-right">

                        <p className="text-sm text-gray-500">

                          Subtotal

                        </p>

                        <h3 className="text-2xl font-black text-primary">

                          {formatPrice(
                            item.precio *
                            item.cantidad
                          )}

                        </h3>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </section>

            {/* ===================================== */}
            {/* RESUMEN */}
            {/* ===================================== */}

            <aside className="sticky top-8 h-fit">

              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8">

                {/* HEADER */}
                <h2 className="text-3xl font-black text-dark mb-8">

                  Resumen

                </h2>

                {/* INFO */}
                <div className="space-y-5">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">

                      Productos

                    </span>

                    <span className="font-bold">

                      {cart.length}

                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">

                      Envío

                    </span>

                    <span className="font-bold text-green-600">

                      Gratis

                    </span>

                  </div>

                  <div className="border-t pt-5 flex items-center justify-between">

                    <span className="text-xl font-bold">

                      Total

                    </span>

                    <span className="text-3xl font-black text-primary">

                      {formatPrice(
                        total
                      )}

                    </span>

                  </div>

                </div>

                {/* BUTTON */}
                <Link href="/checkout">

                  <button className="mt-10 w-full h-16 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-3">

                    Finalizar compra

                    <ArrowRight className="w-5 h-5" />

                  </button>

                </Link>

                {/* BENEFITS */}
                <div className="mt-10 space-y-4">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                      <ShieldCheck className="w-6 h-6" />

                    </div>

                    <div>

                      <h4 className="font-bold">

                        Pago seguro

                      </h4>

                      <p className="text-sm text-gray-500">

                        Compra protegida

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">

                      <Truck className="w-6 h-6" />

                    </div>

                    <div>

                      <h4 className="font-bold">

                        Envíos rápidos

                      </h4>

                      <p className="text-sm text-gray-500">

                        Cobertura nacional

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">

                      <BadgeCheck className="w-6 h-6" />

                    </div>

                    <div>

                      <h4 className="font-bold">

                        Productos originales

                      </h4>

                      <p className="text-sm text-gray-500">

                        Calidad garantizada

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>
        )}

      </div>

    </main>
  );
}