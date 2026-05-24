"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Folder,
  ArrowRight,
  AlertTriangle,
  XCircle,
  Clock3,
} from "lucide-react";

// =====================================
// TYPES
// =====================================

interface DashboardData {

  totalProductos: number;

  totalPedidos: number;

  totalUsuarios: number;

  totalVentas: number;

  pedidosPendientes: number;

  productosStockBajo: {
    id_producto: number;
    nombre: string;
    stock: number;
  }[];

  productosAgotados: {
    id_producto: number;
    nombre: string;
  }[];

  ultimosPedidos: {
    id_pedido: number;
    usuario_nombre: string;
    total: number;
    estado: string;
    fecha: string;
  }[];
}

export default function AdminDashboardPage() {

  const { token } =
    useAuth();

  const [data,
    setData] =
      useState<DashboardData | null>(null);

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/pedidos/dashboard/admin`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchDashboard();
    }

  }, [token]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-10">
        Cargando dashboard...
      </div>
    );
  }

  if (!data) {

    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-black text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Resumen general del negocio
          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {/* PRODUCTOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg hover:shadow-2xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Productos
                </p>

                <h2 className="text-5xl font-black mt-3">

                  {data.totalProductos}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                <Package className="w-8 h-8" />

              </div>

            </div>

          </div>

          {/* PEDIDOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg hover:shadow-2xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Pedidos
                </p>

                <h2 className="text-5xl font-black mt-3">

                  {data.totalPedidos}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <ShoppingCart className="w-8 h-8" />

              </div>

            </div>

          </div>

          {/* USUARIOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg hover:shadow-2xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Usuarios
                </p>

                <h2 className="text-5xl font-black mt-3">

                  {data.totalUsuarios}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">

                <Users className="w-8 h-8" />

              </div>

            </div>

          </div>

          {/* VENTAS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg hover:shadow-2xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Ventas
                </p>

                <h2 className="text-4xl font-black mt-3 text-primary">

                  $
                  {Number(data.totalVentas).toLocaleString(
                    "es-CO",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                <DollarSign className="w-8 h-8" />

              </div>

            </div>

          </div>

        </div>

        {/* ALERTAS */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">

          {/* PEDIDOS PENDIENTES */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-[2rem] p-6">

            <div className="flex items-center gap-4 mb-4">

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center">

                <Clock3 className="w-7 h-7" />

              </div>

              <div>

                <h2 className="text-2xl font-black text-yellow-700">

                  {data.pedidosPendientes}

                </h2>

                <p className="text-yellow-600">

                  Pedidos pendientes

                </p>

              </div>

            </div>

          </div>

          {/* STOCK BAJO */}
          <div className="bg-orange-50 border border-orange-200 rounded-[2rem] p-6">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

                <AlertTriangle className="w-7 h-7" />

              </div>

              <div>

                <h2 className="text-2xl font-black text-orange-700">

                  {data.productosStockBajo.length}

                </h2>

                <p className="text-orange-600">

                  Stock bajo

                </p>

              </div>

            </div>

            <div className="space-y-3">

              {data.productosStockBajo.length === 0 ? (

                <p className="text-sm text-gray-500">

                  Todo el stock está correcto

                </p>

              ) : (

                data.productosStockBajo
                  .slice(0, 3)
                  .map((producto) => (

                  <div
                    key={producto.id_producto}
                    className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
                  >

                    <span className="font-medium text-sm">

                      {producto.nombre}

                    </span>

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">

                      {producto.stock} unidades

                    </span>

                  </div>
                ))
              )}

            </div>

          </div>

          {/* AGOTADOS */}
          <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">

                <XCircle className="w-7 h-7" />

              </div>

              <div>

                <h2 className="text-2xl font-black text-red-700">

                  {data.productosAgotados.length}

                </h2>

                <p className="text-red-600">

                  Productos agotados

                </p>

              </div>

            </div>

            <div className="space-y-3">

              {data.productosAgotados.length === 0 ? (

                <p className="text-sm text-gray-500">

                  No hay productos agotados

                </p>

              ) : (

                data.productosAgotados
                  .slice(0, 3)
                  .map((producto) => (

                  <div
                    key={producto.id_producto}
                    className="bg-white rounded-2xl px-4 py-3"
                  >

                    <span className="font-medium text-sm">

                      {producto.nombre}

                    </span>

                  </div>
                ))
              )}

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* PRODUCTOS */}
          <Link
            href="/admin/productos"
            className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Gestión
                </p>

                <h2 className="text-3xl font-black mt-2">
                  Productos
                </h2>

              </div>

              <Package className="w-10 h-10 text-primary" />

            </div>

            <div className="flex items-center gap-2 mt-8 text-primary font-semibold">

              Administrar

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />

            </div>

          </Link>

          {/* PEDIDOS */}
          <Link
            href="/admin/pedidos"
            className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Gestión
                </p>

                <h2 className="text-3xl font-black mt-2">
                  Pedidos
                </h2>

              </div>

              <ShoppingCart className="w-10 h-10 text-blue-600" />

            </div>

            <div className="flex items-center gap-2 mt-8 text-blue-600 font-semibold">

              Ver pedidos

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />

            </div>

          </Link>

          {/* CATEGORIAS */}
          <Link
            href="/admin/categorias"
            className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Gestión
                </p>

                <h2 className="text-3xl font-black mt-2">
                  Categorías
                </h2>

              </div>

              <Folder className="w-10 h-10 text-purple-600" />

            </div>

            <div className="flex items-center gap-2 mt-8 text-purple-600 font-semibold">

              Administrar

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />

            </div>

          </Link>

        </div>

        {/* ULTIMOS PEDIDOS */}
        <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden">

          {/* HEADER */}
          <div className="p-8 border-b">

            <h2 className="text-3xl font-black">
              Últimos pedidos
            </h2>

            <p className="text-gray-500 mt-2">
              Actividad reciente de la tienda
            </p>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-5">
                    Cliente
                  </th>

                  <th className="text-left p-5">
                    Total
                  </th>

                  <th className="text-left p-5">
                    Estado
                  </th>

                  <th className="text-left p-5">
                    Fecha
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.ultimosPedidos.map(
                  (pedido) => (

                  <tr
                    key={
                      pedido.id_pedido
                    }
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-5 font-semibold">

                      {pedido.usuario_nombre}

                    </td>

                    <td className="p-5 font-bold text-primary">

                      $
                      {Number(pedido.total).toLocaleString(
                        "es-CO",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}

                    </td>

                    <td className="p-5">

                      <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">

                        {pedido.estado}

                      </span>

                    </td>

                    <td className="p-5 text-gray-500">

                      {new Date(
                        pedido.fecha
                      ).toLocaleDateString(
                        "es-CO"
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}