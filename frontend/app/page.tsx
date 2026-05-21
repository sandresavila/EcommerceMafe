"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";

import { Producto } from "@/types/producto";

export default function Home() {

  const [productos,
    setProductos] =
      useState<Producto[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    fetch(
      "http://localhost:4000/api/productos"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setProductos(data);

        setLoading(false);
      })
      .catch(() =>
        setLoading(false)
      );

  }, []);

  const scroll = (
    direction:
      | "left"
      | "right"
  ) => {

    if (
      scrollRef.current
    ) {

      scrollRef.current.scrollBy({
        left:
          direction ===
          "left"
            ? -350
            : 350,

        behavior:
          "smooth",
      });
    }
  };

  return (
    <main className="overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center">

        {/* BG */}
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
          alt="Beauty"
          fill
          priority
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        {/* BLUR */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full mb-8">

              <Sparkles className="w-4 h-4" />

              Belleza premium personalizada

            </div>

            {/* TITLE */}
            <h1 className="text-6xl md:text-7xl font-black leading-tight text-white">

              Descubre
              <span className="block text-primary">
                tu mejor versión
              </span>

            </h1>

            {/* TEXT */}
            <p className="mt-8 text-xl text-gray-200 max-w-2xl leading-relaxed">

              Productos de belleza seleccionados cuidadosamente para acompañarte en cada momento.

            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-10">

              <Link href="/productos">

                <button className="bg-primary hover:scale-105 transition px-8 py-4 rounded-2xl text-white font-bold shadow-2xl">

                  Comprar ahora

                </button>

              </Link>

              <button className="border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition px-8 py-4 rounded-2xl text-white font-semibold">

                Asesoría personalizada

              </button>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-16">

              <div>

                <h3 className="text-3xl font-bold text-white">
                  +500
                </h3>

                <p className="text-gray-300 mt-2">
                  Productos
                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-white">
                  +2K
                </h3>

                <p className="text-gray-300 mt-2">
                  Clientes
                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-white">
                  24/7
                </h3>

                <p className="text-gray-300 mt-2">
                  Asesoría
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* BENEFICIOS */}
      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          {[
            {
              icon:
                <Truck className="w-10 h-10 text-primary" />,
              title:
                "Envíos rápidos",
              text:
                "Recibe tus productos en tiempo récord.",
            },

            {
              icon:
                <ShieldCheck className="w-10 h-10 text-primary" />,
              title:
                "Productos originales",
              text:
                "Garantizamos autenticidad y calidad.",
            },

            {
              icon:
                <BadgeCheck className="w-10 h-10 text-primary" />,
              title:
                "Asesoría premium",
              text:
                "Te acompañamos antes y después de tu compra.",
            },
          ].map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="bg-gray-50 rounded-[2rem] p-10 shadow-sm hover:shadow-xl transition"
              >

                {item.icon}

                <h3 className="text-2xl font-bold mt-6">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-4 leading-relaxed">
                  {item.text}
                </p>

              </div>
            )
          )}

        </div>

      </section>

      {/* PRODUCTOS */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">

        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-14">

            <div>

              <p className="text-primary font-semibold mb-3">
                Productos destacados
              </p>

              <h2 className="text-5xl font-black text-gray-900">
                Lo más vendido ✨
              </h2>

            </div>

            {/* NAV */}
            <div className="hidden md:flex gap-4">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
              >

                <ChevronLeft />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
              >

                <ChevronRight />

              </button>

            </div>

          </div>

          {/* PRODUCTS */}
          {loading ? (

            <div className="text-center py-20">
              Cargando productos...
            </div>

          ) : (

            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >

              {productos.map(
                (
                  producto
                ) => (

                  <div
                    key={
                      producto.id_producto
                    }
                    className="min-w-[320px]"
                  >

                    <ProductCard
                      producto={
                        producto
                      }
                    />

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-primary to-pink-500" />

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_40%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">

          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">

            Tu experiencia beauty empieza aquí ✨

          </h2>

          <p className="text-white/90 text-xl mt-8 leading-relaxed">

            Encuentra productos originales, asesoría personalizada y una experiencia premium.

          </p>

          <Link href="/productos">

            <button className="mt-10 bg-white text-primary hover:scale-105 transition px-10 py-5 rounded-3xl font-bold text-lg shadow-2xl">

              Explorar catálogo

            </button>

          </Link>

        </div>

      </section>

    </main>
  );
}