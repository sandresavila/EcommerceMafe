"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProductCard
  from "@/components/ProductCard";

import {
  Producto,
} from "@/types/producto";

interface Categoria {

  id_categoria: number;

  nombre: string;
}

export default function ProductosPage() {

  const [productos,
    setProductos] =
      useState<Producto[]>([]);

  const [categorias,
    setCategorias] =
      useState<Categoria[]>([]);

  const [busqueda,
    setBusqueda] =
      useState("");

  const [categoriaSeleccionada,
    setCategoriaSeleccionada] =
      useState<number | null>(null);

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // CARGAR PRODUCTOS
  // =====================================

  useEffect(() => {

    const fetchProductos =
      async () => {

        try {

          const response =
            await fetch(
              "http://localhost:4000/api/productos"
            );

          const data =
            await response.json();

          setProductos(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchProductos();

  }, []);

  // =====================================
  // CARGAR CATEGORIAS
  // =====================================

  useEffect(() => {

    const fetchCategorias =
      async () => {

        try {

          const response =
            await fetch(
              "http://localhost:4000/api/categorias"
            );

          const data =
            await response.json();

          setCategorias(data);

        } catch (error) {

          console.error(error);
        }
      };

    fetchCategorias();

  }, []);

  // =====================================
  // FILTROS
  // =====================================

  const productosFiltrados =
    useMemo(() => {

      return productos.filter(
        (producto) => {

          // BUSQUEDA
          const matchBusqueda =
            producto.nombre
              .toLowerCase()
              .includes(
                busqueda.toLowerCase()
              );

          // CATEGORIA
          const matchCategoria =
            categoriaSeleccionada
              ? producto.id_categoria ===
                categoriaSeleccionada
              : true;

          return (
            matchBusqueda &&
            matchCategoria
          );
        }
      );

    }, [
      productos,
      busqueda,
      categoriaSeleccionada,
    ]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 md:px-10 py-12">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">

          <h1 className="text-5xl font-bold text-primary mb-4">

            Explora nuestros productos ✨

          </h1>

          <p className="text-gray-600 text-lg">

            Maquillaje, skincare,
            belleza y mucho más

          </p>

        </div>

        {/* LAYOUT */}
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <aside className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-8">

            {/* BUSCADOR */}
            <div className="mb-8">

              <h2 className="font-bold text-xl mb-4">
                Buscar
              </h2>

              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

            {/* CATEGORIAS */}
            <div>

              <h2 className="font-bold text-xl mb-4">
                Categorías
              </h2>

              <div className="space-y-3">

                {/* TODAS */}
                <button
                  onClick={() =>
                    setCategoriaSeleccionada(
                      null
                    )
                  }
                  className={`w-full text-left px-4 py-3 rounded-2xl transition
                  ${
                    categoriaSeleccionada ===
                    null
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>

                {/* CATEGORIAS */}
                {categorias.map(
                  (categoria) => (

                  <button
                    key={
                      categoria.id_categoria
                    }
                    onClick={() =>
                      setCategoriaSeleccionada(
                        categoria.id_categoria
                      )
                    }
                    className={`w-full text-left px-4 py-3 rounded-2xl transition
                    ${
                      categoriaSeleccionada ===
                      categoria.id_categoria
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >

                    {categoria.nombre}

                  </button>
                ))}

              </div>

            </div>

            {/* LIMPIAR */}
            <button
              onClick={() => {

                setBusqueda("");

                setCategoriaSeleccionada(
                  null
                );
              }}
              className="mt-8 w-full bg-secondary text-white py-3 rounded-2xl"
            >
              Limpiar filtros
            </button>

          </aside>

          {/* PRODUCTOS */}
          <section className="lg:col-span-3">

            {/* TOPBAR */}
            <div className="flex items-center justify-between mb-8">

              <h2 className="text-2xl font-bold">

                Productos

              </h2>

              <span className="text-gray-500">

                {
                  productosFiltrados.length
                }
                {" "}
                resultados

              </span>

            </div>

            {/* LOADING */}
            {loading ? (

              <div className="text-center py-20">

                <p className="text-gray-500 text-lg">
                  Cargando productos...
                </p>

              </div>

            ) : productosFiltrados.length === 0 ? (

              <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

                <h3 className="text-2xl font-bold mb-4">
                  No encontramos productos
                </h3>

                <p className="text-gray-500">

                  Intenta cambiar los filtros
                  o la búsqueda

                </p>

              </div>

            ) : (

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {productosFiltrados.map(
                  (producto) => (

                  <ProductCard
                    key={
                      producto.id_producto
                    }
                    producto={producto}
                  />
                ))}

              </div>
            )}

            {/* CTA */}
            <div className="mt-16 bg-white rounded-3xl shadow-lg p-10 text-center">

              <h2 className="text-3xl font-bold text-primary mb-4">

                ¿Necesitas ayuda?

              </h2>

              <p className="text-gray-600 mb-6">

                Nuestro equipo puede ayudarte
                a encontrar el producto ideal

              </p>

              <button className="bg-secondary text-white px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition">

                💬 Hablar con un asesor

              </button>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}