"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Producto } from "@/types/producto";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
          className="absolute w-full h-full object-cover"
          alt="Belleza"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Tu belleza, acompañada en cada compra 💖
          </h1>

          <p className="mt-4 text-lg max-w-xl mx-auto">
            Recibe asesoría personalizada y encuentra los productos ideales para ti
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/productos">
              <button className="bg-primary px-6 py-3 rounded-xl hover-scale shadow-lg">
                Explorar productos
              </button>
            </Link>

            <button className="border border-white px-6 py-3 rounded-xl hover-scale">
              Recibir asesoría
            </button>
          </div>
        </div>

      </section>

      {/* QUIÉNES SOMOS */}
      <section className="grid md:grid-cols-2 gap-10 px-6 md:px-12 lg:px-20 py-16 items-center">

        <div>
          <h2 className="text-3xl font-bold text-primary">
            Nuestra esencia
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            En MAFE no solo vendemos productos de belleza, te acompañamos en cada paso.
            Nuestro objetivo es ayudarte a elegir lo mejor para ti, con asesoría
            personalizada y productos de alta calidad.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348"
          className="rounded-2xl shadow-lg"
          alt="Belleza"
        />

      </section>

      {/* CATEGORÍAS */}
      <section className="px-6 md:px-16 lg:px-24 py-16">

        <h2 className="text-3xl font-bold text-center mb-10 text-dark">
          Categorías
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {[
            "Maquillaje",
            "Skincare",
            "Capilar",
            "Fragancias",
            "Corporal",
          ].map((cat) => (
            <div
              key={cat}
              className="bg-white rounded-xl shadow-md p-6 text-center hover-scale cursor-pointer"
            >
              <p className="font-semibold">{cat}</p>
            </div>
          ))}

        </div>

      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="px-6 md:px-16 lg:px-24 py-16 bg-gray-50">

        <h2 className="text-3xl font-bold mb-10 text-dark text-center">
          Productos destacados
        </h2>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="relative">

            {/* BOTÓN IZQUIERDA */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full hover:scale-110 transition"
            >
              ⬅
            </button>

            {/* CARRUSEL */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-4 md:px-8"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {productos.map((producto) => (
                <div
                  key={producto.id_producto}
                  className="min-w-[280px] md:min-w-[300px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>

            {/* BOTÓN DERECHA */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full hover:scale-110 transition"
            >
              ➡
            </button>

          </div>
        )}

      </section>

      {/* ASESORÍA */}
      <section className="px-6 md:px-16 lg:px-24 py-16 text-center">

        <h2 className="text-3xl font-bold text-primary">
          ¿No sabes qué producto elegir?
        </h2>

        <p className="mt-4 text-gray-600">
          Nuestro equipo te ayuda a encontrar lo ideal para ti
        </p>

        <button className="mt-6 bg-secondary text-white px-6 py-3 rounded-xl hover-scale shadow-md">
          Hablar con un asesor
        </button>

      </section>

      {/* CTA FINAL */}
      <section className="bg-brand-gradient text-center py-16 text-white">

        <h2 className="text-3xl font-bold">
          Encuentra los productos ideales para ti ✨
        </h2>

        <p className="mt-2 text-lg">
          Con asesoría personalizada en cada compra
        </p>

        <Link href="/productos">
          <button className="mt-6 bg-gold text-dark px-6 py-3 rounded-xl hover-scale shadow-md">
            Comprar ahora
          </button>
        </Link>

      </section>

    </main>
  );
}