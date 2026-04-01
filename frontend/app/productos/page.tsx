"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Producto } from "@/types/producto";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));
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
          Nuestros Productos
        </h1>

        <p className="text-gray-600 mt-2">
          Encuentra lo mejor para tu cuidado personal
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar productos..."
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
          <option value="1">Uñas</option>
          <option value="2">Depilación</option>
          <option value="3">Cuidado personal</option>
          <option value="4">Distribución</option>
        </select>

        {/* RESULTADOS */}
        <span className="text-sm text-gray-500">
          {filtrados.length} productos
        </span>

      </div>

      {/* GRID */}
      {filtrados.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron productos
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtrados.map((producto) => (
            <ProductCard
              key={producto.id_producto}
              producto={producto}
            />
          ))}
        </div>
      )}

    </main>
  );
}