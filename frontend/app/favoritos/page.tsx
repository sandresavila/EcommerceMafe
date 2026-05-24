"use client";

import Link from "next/link";

import Image from "next/image";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useCart,
} from "@/context/CartContext";

import {
  useFavorites,
} from "@/context/FavoritesContext";

import {
  Producto,
} from "@/types/producto";

export default function FavoritosPage() {

  const {
    favoritos,
    removeFavorito,
  } = useFavorites();

  const {
    addToCart,
  } = useCart();

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
  // ELIMINAR FAVORITO
  // =====================================

  const eliminarFavorito =
    async (
      id_producto: number
    ) => {

      try {

        await removeFavorito(
          id_producto
        );

        toast.success(
          "Producto eliminado de favoritos ❤️"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error eliminando favorito"
        );
      }
    };

  // =====================================
  // AGREGAR AL CARRITO
  // =====================================

  const agregarCarrito =
    (producto: Producto) => {

      addToCart(producto);

      toast.success(
        "Producto agregado al carrito 🛒"
      );
    };

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden px-4 md:px-8 py-14">

      <div className="max-w-7xl mx-auto">

        {/* ===================================== */}
        {/* HERO */}
        {/* ===================================== */}

        <section className="text-center mb-16 fade-in">

          <div className="inline-flex items-center gap-3 bg-red-100 text-red-500 px-6 py-3 rounded-full font-semibold mb-6">

            <Heart className="w-5 h-5 fill-red-500" />

            Lista de favoritos

          </div>

          <h1 className="text-5xl md:text-6xl font-black text-dark">

            Mis favoritos ❤️

          </h1>

          <p className="text-gray-500 text-lg mt-5 max-w-2xl mx-auto">

            Guarda tus productos favoritos y accede rápidamente
            a ellos cuando quieras comprarlos.

          </p>

        </section>

        {/* ===================================== */}
        {/* EMPTY */}
        {/* ===================================== */}

        {favoritos.length === 0 ? (

          <div className="bg-white rounded-[2.5rem] shadow-2xl p-14 md:p-20 text-center zoom-in">

            <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-10">

              <Heart className="w-16 h-16 text-red-500" />

            </div>

            <h2 className="text-4xl font-black text-dark">

              No tienes favoritos aún

            </h2>

            <p className="text-gray-500 mt-5 text-lg max-w-xl mx-auto leading-relaxed">

              Explora nuestro catálogo y guarda productos
              que te interesen para encontrarlos fácilmente después.

            </p>

            <Link href="/productos">

              <button className="mt-10 bg-primary hover:scale-105 transition text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl">

                Explorar productos

              </button>

            </Link>

          </div>

        ) : (

          <>

            {/* ===================================== */}
            {/* TOPBAR */}
            {/* ===================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

              <div>

                <h2 className="text-3xl font-black text-dark">

                  Productos guardados

                </h2>

                <p className="text-gray-500 mt-2">

                  {favoritos.length}
                  {" "}
                  productos en favoritos

                </p>

              </div>

              <div className="bg-white rounded-2xl shadow-md px-5 py-4 flex items-center gap-3">

                <Sparkles className="w-5 h-5 text-primary" />

                <span className="font-semibold text-dark">

                  Tus productos favoritos

                </span>

              </div>

            </div>

            {/* ===================================== */}
            {/* GRID */}
            {/* ===================================== */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {favoritos.map(
                (producto: Producto) => (

                <div
                  key={
                    producto.id_producto
                  }
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 flex flex-col"
                >

                  {/* IMAGE */}
                  <Link
                    href={`/producto/${producto.id_producto}`}
                  >

                    <div className="relative h-80 overflow-hidden">

                      {/* BADGE */}
                      <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-primary shadow-lg">

                        Favorito ❤️

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={(e) => {

                          e.preventDefault();

                          eliminarFavorito(
                            producto.id_producto
                          );
                        }}
                        className="absolute top-5 right-5 z-20 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition"
                      >

                        <Trash2 className="w-5 h-5" />

                      </button>

                      <Image
                        src={
                          producto.imagen_url ||
                          "/placeholder.png"
                        }
                        alt={
                          producto.nombre
                        }
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />

                    </div>

                  </Link>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1">

                    <h3 className="text-2xl font-black text-dark line-clamp-2">

                      {producto.nombre}

                    </h3>

                    <p className="text-primary text-3xl font-black mt-4">

                      {formatPrice(
                        producto.precio
                      )}

                    </p>

                    {/* INFO */}
                    <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">

                      <ShieldCheck className="w-4 h-4 text-green-500" />

                      Producto original garantizado

                    </div>

                    {/* BUTTONS */}
                    <div className="mt-auto pt-8 space-y-3">

                      {/* CARRITO */}
                      <button
                        onClick={() =>
                          agregarCarrito(
                            producto
                          )
                        }
                        className="w-full h-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition shadow-xl"
                      >

                        <ShoppingCart className="w-5 h-5" />

                        Agregar al carrito

                      </button>

                      {/* DETALLE */}
                      <Link
                        href={`/producto/${producto.id_producto}`}
                      >

                        <button className="w-full h-14 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition flex items-center justify-center gap-3">

                          Ver producto

                          <ArrowRight className="w-5 h-5" />

                        </button>

                      </Link>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </>
        )}

      </div>

    </main>
  );
}