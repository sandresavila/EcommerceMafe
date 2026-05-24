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
  ArrowRight,
  Star,
  HeartHandshake,
} from "lucide-react";

import ProductCard
  from "@/components/ProductCard";

import {
  Producto,
} from "@/types/producto";

export default function Home() {

  const [productos,
    setProductos] =
      useState<Producto[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  // =====================================
  // FETCH PRODUCTOS
  // =====================================

  useEffect(() => {

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos`
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

  // =====================================
  // SCROLL PRODUCTOS
  // =====================================

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

    <main className="overflow-hidden bg-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center">

        {/* BG */}
        <Image
          src="/fondo3.jpeg"
          alt="Beauty"
          fill
          priority
          className="object-cover scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        {/* LIGHT EFFECT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,30,99,0.15),transparent_35%)]" />

        {/* DECOR */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 blur-[120px] rounded-full" />

        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 blur-[140px] rounded-full" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="fade-in">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-full mb-8 shadow-xl">

              <Sparkles className="w-4 h-4" />

              Belleza premium personalizada

            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white">

              Descubre
              <span className="block text-primary mt-2">
                tu mejor versión
              </span>

            </h1>

            {/* TEXT */}
            <p className="mt-8 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">

              Productos de belleza, skincare y asesoría personalizada para ayudarte a sentirte increíble todos los días.

            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-10">

              {/* SHOP */}
              <Link href="/productos">

                <button className="group bg-primary hover:bg-pink-600 transition-all px-8 py-4 rounded-2xl text-white font-bold shadow-2xl flex items-center gap-3 hover:scale-105">

                  Comprar ahora

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />

                </button>

              </Link>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/qr/OY37IJHI5JKUG1"
                target="_blank"
                rel="noopener noreferrer"
              >

                <button className="border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition px-8 py-4 rounded-2xl text-white font-semibold">

                  Asesoría personalizada

                </button>

              </a>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-16">

              {[
                {
                  number: "+500",
                  label: "Productos",
                },

                {
                  number: "+2K",
                  label: "Clientes felices",
                },

                {
                  number: "24/7",
                  label: "Asesoría",
                },
              ].map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5"
                  >

                    <h3 className="text-3xl font-black text-white">

                      {item.number}

                    </h3>

                    <p className="text-gray-300 mt-2 text-sm">

                      {item.label}

                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex justify-center slide-right">

            <div className="relative">

              {/* CARD */}
              <div className="w-[380px] bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">

                <div className="flex items-center justify-between mb-8">

                  <div>

                    <p className="text-white/70 text-sm">

                      Tendencia beauty

                    </p>

                    <h3 className="text-white text-3xl font-black mt-2">

                      Glow Skin ✨

                    </h3>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl">

                    <Star className="w-6 h-6 text-white" />

                  </div>

                </div>

                {/* IMAGE */}
                <video
                  src="/Video iluminador mafe.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-[2rem] h-[320px] w-full object-cover"
                ></video>

                {/* FOOTER */}
                <div className="mt-8 flex items-center justify-between">

                  <div>

                    <p className="text-white/70 text-sm">

                      Productos premium

                    </p>

                    <Link
                      href="/productos?categoria=facial"
                      className="text-white text-xl font-bold mt-1 block hover:text-pink-200 transition"
                    >

                      Cuidado facial

                    </Link>

                  </div>

                  <Link href="/productos">

                    <button className="bg-white text-primary px-5 py-3 rounded-2xl font-bold hover:scale-105 transition">

                      Ver más

                    </button>

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* BENEFICIOS */}
      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          {/* TITLE */}
          <div className="text-center mb-16">

            <p className="text-primary font-semibold mb-3">

              ¿Por qué elegirnos?

            </p>

            <h2 className="text-5xl font-black text-gray-900">

              Una experiencia beauty premium

            </h2>

          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                icon:
                  <Truck className="w-10 h-10 text-primary" />,
                title:
                  "Envíos rápidos",
                text:
                  "Recibe tus productos en tiempo récord con total seguridad.",
              },

              {
                icon:
                  <ShieldCheck className="w-10 h-10 text-primary" />,
                title:
                  "Productos originales",
                text:
                  "Garantizamos autenticidad y calidad en cada compra.",
              },

              {
                icon:
                  <HeartHandshake className="w-10 h-10 text-primary" />,
                title:
                  "Asesoría personalizada",
                text:
                  "Te ayudamos a elegir el producto ideal para ti.",
              },
            ].map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="group bg-gradient-to-b from-white to-pink-50 rounded-[2rem] p-10 border border-pink-100 hover:shadow-2xl transition-all hover:-translate-y-2"
                >

                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-all">

                    <div className="group-hover:text-white transition-all">

                      {item.icon}

                    </div>

                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">

                    {item.title}

                  </h3>

                  <p className="text-gray-500 mt-4 leading-relaxed">

                    {item.text}

                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* PRODUCTOS */}
      <section className="py-24 bg-gradient-to-b from-pink-50 to-white">

        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">

            <div>

              <p className="text-primary font-semibold mb-3">

                Productos destacados

              </p>

              <h2 className="text-5xl font-black text-gray-900 leading-tight">

                Lo más vendido ✨

              </h2>

            </div>

            {/* NAV */}
            <div className="hidden md:flex gap-4">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition"
              >

                <ChevronLeft />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:scale-110 transition"
              >

                <ChevronRight />

              </button>

            </div>

          </div>

          {/* PRODUCTS */}
          {loading ? (

            <div className="text-center py-20 text-lg text-gray-500">

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

      {/* TESTIMONIOS */}
      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          {/* TITLE */}
          <div className="text-center mb-16">

            <p className="text-primary font-semibold mb-3">

              Opiniones reales

            </p>

            <h2 className="text-5xl font-black text-gray-900">

              Lo que dicen nuestros clientes

            </h2>

          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                name: "Laura",
                text:
                  "Excelente atención y productos originales. La asesoría fue increíble.",
              },

              {
                name: "Camila",
                text:
                  "La experiencia de compra fue súper rápida y segura.",
              },

              {
                name: "Valentina",
                text:
                  "Definitivamente volveré a comprar. Todo llegó perfecto.",
              },
            ].map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="bg-gradient-to-b from-pink-50 to-white border border-pink-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition"
                >

                  <div className="flex gap-1 text-yellow-400 mb-5">

                    ★★★★★

                  </div>

                  <p className="text-gray-600 leading-relaxed">

                    “{item.text}”

                  </p>

                  <div className="mt-8 flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">

                      {item.name.charAt(0)}

                    </div>

                    <div>

                      <h4 className="font-bold text-gray-900">

                        {item.name}

                      </h4>

                      <p className="text-sm text-gray-500">

                        Cliente MAFE

                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

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