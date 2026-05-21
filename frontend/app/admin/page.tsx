"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useAuth,
} from "@/context/AuthContext";

interface DashboardData {

  totalProductos: number;

  totalPedidos: number;

  totalUsuarios: number;

  totalVentas: number;

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

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Resumen general del negocio
          </p>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {/* PRODUCTOS */}
          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-gray-500 mb-2">
              Productos
            </h2>

            <p className="text-4xl font-bold">
              {
                data.totalProductos
              }
            </p>

          </div>

          {/* PEDIDOS */}
          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-gray-500 mb-2">
              Pedidos
            </h2>

            <p className="text-4xl font-bold">
              {
                data.totalPedidos
              }
            </p>

          </div>

          {/* USUARIOS */}
          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-gray-500 mb-2">
              Usuarios
            </h2>

            <p className="text-4xl font-bold">
              {
                data.totalUsuarios
              }
            </p>

          </div>

          {/* VENTAS */}
          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-gray-500 mb-2">
              Ventas
            </h2>

            <p className="text-4xl font-bold text-primary">
              $
              {
                data.totalVentas
              }
            </p>

          </div>

        </div>

        {/* ULTIMOS PEDIDOS */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Últimos pedidos
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Cliente
                </th>

                <th className="text-left p-4">
                  Total
                </th>

                <th className="text-left p-4">
                  Estado
                </th>

                <th className="text-left p-4">
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
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {
                      pedido.usuario_nombre
                    }
                  </td>

                  <td className="p-4 font-bold text-primary">
                    $
                    {pedido.total}
                  </td>

                  <td className="p-4">
                    {pedido.estado}
                  </td>

                  <td className="p-4 text-gray-500">

                    {new Date(
                      pedido.fecha
                    ).toLocaleDateString()}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}