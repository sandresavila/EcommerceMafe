"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Producto } from "@/types/producto";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔍 FILTROS
  const filtrados = productos.filter((p) => {
    const matchBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const matchCategoria = categoria
      ? p.id_categoria === Number(categoria)
      : true;

    return matchBusqueda && matchCategoria;
  });

  return (
    <main className="px-6 md:px-10 py-12 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-primary">
          Encuentra tu producto ideal 💄
        </h1>

        <p className="text-gray-600 mt-2">
          Belleza, cuidado personal y asesoría en un solo lugar
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar maquillaje, skincare, etc..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* CATEGORÍA */}
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border px-4 py-2 rounded-xl focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          <option value="1">Maquillaje</option>
          <option value="2">Skincare</option>
          <option value="3">Cuidado capilar</option>
          <option value="4">Fragancias</option>
          <option value="5">Cuidado corporal</option>
        </select>

        {/* RESULTADOS */}
        <span className="text-sm text-gray-500">
          {filtrados.length} productos
        </span>

      </div>

      {/* ESTADO */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : filtrados.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No se encontraron productos</p>

          <button
            onClick={() => {
              setBusqueda("");
              setCategoria("");
            }}
            className="mt-4 text-primary underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtrados.map((producto) => (
              <ProductCard
                key={producto.id_producto}
                producto={producto}
              />
            ))}
          </div>

          {/* ASESORÍA */}
          <div className="mt-16 text-center bg-gray-50 p-10 rounded-2xl border">

            <h2 className="text-2xl font-bold text-primary">
              ¿No encuentras lo que buscas?
            </h2>

            <p className="text-gray-600 mt-2">
              Nuestro equipo te ayuda a elegir el producto perfecto para ti
            </p>

            <button className="mt-6 bg-secondary text-white px-6 py-3 rounded-xl hover-scale">
              💬 Hablar con un asesor
            </button>

          </div>

        </>
      )}

    </main>
  );
}