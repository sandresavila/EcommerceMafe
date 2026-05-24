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

import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";

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

  const [precioMin,
    setPrecioMin] =
      useState("");

  const [precioMax,
    setPrecioMax] =
      useState("");

  const [orden,
    setOrden] =
      useState("recientes");

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // FETCH PRODUCTOS + CATEGORIAS
  // =====================================

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const [
            productosRes,
            categoriasRes,
          ] =
            await Promise.all([

              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/productos`
              ),

              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/categorias`
              ),
            ]);

          const productosData =
            await productosRes.json();

          const categoriasData =
            await categoriasRes.json();

          setProductos(
            productosData
          );

          setCategorias(
            categoriasData
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  // =====================================
  // FILTROS
  // =====================================

  const productosFiltrados =
    useMemo(() => {

      const resultado =
        productos.filter(
          (producto) => {

            const matchBusqueda =
              producto.nombre
                .toLowerCase()
                .includes(
                  busqueda.toLowerCase()
                );

            const matchCategoria =
              categoriaSeleccionada
                ? producto.id_categoria ===
                  categoriaSeleccionada
                : true;

            const matchMin =
              precioMin
                ? Number(producto.precio) >=
                  Number(precioMin)
                : true;

            const matchMax =
              precioMax
                ? Number(producto.precio) <=
                  Number(precioMax)
                : true;

            return (
              matchBusqueda &&
              matchCategoria &&
              matchMin &&
              matchMax
            );
          }
        );

      // =====================================
      // ORDENAMIENTO
      // =====================================

      switch (orden) {

        case "menor-precio":

          resultado.sort(
            (a, b) =>
              Number(a.precio) -
              Number(b.precio)
          );

          break;

        case "mayor-precio":

          resultado.sort(
            (a, b) =>
              Number(b.precio) -
              Number(a.precio)
          );

          break;

        default:

          resultado.sort(
            (a, b) =>
              b.id_producto -
              a.id_producto
          );
      }

      return resultado;

    }, [
      productos,
      busqueda,
      categoriaSeleccionada,
      precioMin,
      precioMax,
      orden,
    ]);

  // =====================================
  // LIMPIAR FILTROS
  // =====================================

  const limpiarFiltros =
    () => {

      setBusqueda("");

      setCategoriaSeleccionada(
        null
      );

      setPrecioMin("");

      setPrecioMax("");

      setOrden("recientes");
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">

        <div className="text-center">

          <div className="w-20 h-20 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

          <p className="mt-6 text-gray-500 text-lg">

            Cargando productos...

          </p>

        </div>

      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden">

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section className="relative px-6 md:px-10 pt-24 pb-16">

        {/* BG */}
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.05]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center fade-in">

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-semibold text-sm mb-6">

            <Sparkles className="w-4 h-4" />

            Catálogo MAFE

          </div>

          <h1 className="text-5xl md:text-7xl font-black text-dark leading-tight">

            Descubre nuestros
            <span className="text-primary block">

              productos premium

            </span>

          </h1>

          <p className="mt-8 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">

            Encuentra maquillaje, skincare, cuidado personal
            y productos exclusivos seleccionados especialmente
            para resaltar tu belleza.

          </p>

        </div>

      </section>

      {/* ===================================== */}
      {/* CONTENIDO */}
      {/* ===================================== */}

      <section className="px-6 md:px-10 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-4 gap-8">

            {/* ===================================== */}
            {/* SIDEBAR */}
            {/* ===================================== */}

            <aside className="lg:sticky lg:top-8 h-fit">

              <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl p-6">

                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">

                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                    <SlidersHorizontal className="w-6 h-6" />

                  </div>

                  <div>

                    <h2 className="text-2xl font-black text-dark">

                      Filtros

                    </h2>

                    <p className="text-gray-500 text-sm">

                      Personaliza tu búsqueda

                    </p>

                  </div>

                </div>

                {/* SEARCH */}
                <div className="mb-8">

                  <label className="font-semibold text-dark text-sm">

                    Buscar producto

                  </label>

                  <div className="relative mt-3">

                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={busqueda}
                      onChange={(e) =>
                        setBusqueda(
                          e.target.value
                        )
                      }
                      className="w-full h-14 border border-gray-200 bg-gray-50 rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                    />

                  </div>

                </div>

                {/* CATEGORIAS */}
                <div className="mb-8">

                  <label className="font-semibold text-dark text-sm">

                    Categorías

                  </label>

                  <div className="space-y-3 mt-4">

                    {/* TODAS */}
                    <button
                      onClick={() =>
                        setCategoriaSeleccionada(
                          null
                        )
                      }
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition font-medium
                      ${
                        categoriaSeleccionada ===
                        null
                          ? "bg-primary text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200 text-dark"
                      }`}
                    >

                      Todas

                      <ChevronRight className="w-5 h-5" />

                    </button>

                    {/* ITEMS */}
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
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition font-medium
                        ${
                          categoriaSeleccionada ===
                          categoria.id_categoria
                            ? "bg-primary text-white shadow-lg"
                            : "bg-gray-100 hover:bg-gray-200 text-dark"
                        }`}
                      >

                        {categoria.nombre}

                        <ChevronRight className="w-5 h-5" />

                      </button>
                    ))}

                  </div>

                </div>

                {/* PRECIOS */}
                <div>

                  <label className="font-semibold text-dark text-sm">

                    Rango de precios

                  </label>

                  <div className="space-y-3 mt-4">

                    <input
                      type="number"
                      placeholder="Precio mínimo"
                      value={precioMin}
                      onChange={(e) =>
                        setPrecioMin(
                          e.target.value
                        )
                      }
                      className="w-full h-14 border border-gray-200 bg-gray-50 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                      type="number"
                      placeholder="Precio máximo"
                      value={precioMax}
                      onChange={(e) =>
                        setPrecioMax(
                          e.target.value
                        )
                      }
                      className="w-full h-14 border border-gray-200 bg-gray-50 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-primary"
                    />

                  </div>

                </div>

                {/* LIMPIAR */}
                <button
                  onClick={
                    limpiarFiltros
                  }
                  className="mt-8 w-full bg-secondary text-white h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                >

                  <X className="w-5 h-5" />

                  Limpiar filtros

                </button>

              </div>

            </aside>

            {/* ===================================== */}
            {/* PRODUCTOS */}
            {/* ===================================== */}

            <section className="lg:col-span-3">

              {/* TOPBAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

                <div>

                  <h2 className="text-4xl font-black text-dark">

                    Productos

                  </h2>

                  <p className="text-gray-500 mt-2">

                    {
                      productosFiltrados.length
                    }
                    {" "}
                    productos encontrados

                  </p>

                </div>

                {/* ORDEN */}
                <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md px-5 py-4">

                  <SlidersHorizontal className="w-5 h-5 text-gray-500" />

                  <select
                    value={orden}
                    onChange={(e) =>
                      setOrden(
                        e.target.value
                      )
                    }
                    className="outline-none bg-transparent font-medium"
                  >

                    <option value="recientes">
                      Más recientes
                    </option>

                    <option value="menor-precio">
                      Menor precio
                    </option>

                    <option value="mayor-precio">
                      Mayor precio
                    </option>

                  </select>

                </div>

              </div>

              {/* EMPTY */}
              {productosFiltrados.length === 0 ? (

                <div className="bg-white rounded-[2rem] shadow-xl p-16 text-center fade-in">

                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">

                    <Search className="w-10 h-10 text-primary" />

                  </div>

                  <h3 className="text-3xl font-black text-dark mt-8">

                    No encontramos productos

                  </h3>

                  <p className="text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">

                    Intenta cambiar los filtros o realizar otra búsqueda.

                  </p>

                  <button
                    onClick={
                      limpiarFiltros
                    }
                    className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
                  >

                    Limpiar filtros

                  </button>

                </div>

              ) : (

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 fade-in">

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
              <div className="relative overflow-hidden mt-16 rounded-[3rem] bg-brand-gradient p-10 md:p-14 text-white shadow-2xl">

                {/* BG */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">

                  <h2 className="text-4xl md:text-5xl font-black leading-tight">

                    ¿Necesitas ayuda
                    para elegir?

                  </h2>

                  <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">

                    Nuestro equipo puede ayudarte a encontrar
                    el producto perfecto para ti.

                  </p>

                  <button className="mt-8 bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-2xl">

                    💬 Hablar con un asesor

                  </button>

                </div>

              </div>

            </section>

          </div>

        </div>

      </section>

    </main>
  );
}