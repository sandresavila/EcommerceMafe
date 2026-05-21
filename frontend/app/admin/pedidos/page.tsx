"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  useAuth,
} from "@/context/AuthContext";

interface Pedido {
  id_pedido: number;

  usuario_nombre: string;

  total: number;

  estado: string;

  direccion_envio: string;

  fecha: string;
}

interface ProductoDetalle {

  id_producto: number;

  nombre: string;

  imagen_url: string;

  cantidad: number;

  precio_unitario: number;
}

interface DetallePedido {

  id_pedido: number;

  total: number;

  productos: ProductoDetalle[];
}

export default function AdminPedidosPage() {

  const { token } =
    useAuth();

  const [pedidos,
    setPedidos] =
      useState<Pedido[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // MODAL
  // =====================================

  const [showModal,
    setShowModal] =
      useState(false);

  const [detallePedido,
    setDetallePedido] =
        useState<DetallePedido | null>(null);

  // =====================================
  // CARGAR PEDIDOS
  // =====================================

  useEffect(() => {

    const fetchPedidos =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/pedidos`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setPedidos(
            response.data
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchPedidos();
    }

  }, [token]);

  // =====================================
  // CAMBIAR ESTADO
  // =====================================

  const cambiarEstado =
    async (
      id: number,
      estado: string
    ) => {

      try {

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${id}`,
          {
            estado,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setPedidos((prev) =>
          prev.map((pedido) =>
            pedido.id_pedido === id
              ? {
                  ...pedido,
                  estado,
                }
              : pedido
          )
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =====================================
  // VER DETALLE PEDIDO
  // =====================================

  const verDetallePedido =
    async (id: number) => {

      try {

        const response =
          await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setDetallePedido(
          response.data
        );

        setShowModal(true);

      } catch (error) {

        console.error(error);
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-10">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-4xl font-bold">
              Pedidos
            </h1>

            <p className="text-gray-600 mt-2">
              Gestión de pedidos
            </p>

          </div>

          {/* TABLA */}
          <div className="bg-white rounded-3xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    Cliente
                  </th>

                  <th className="text-left p-4">
                    Dirección
                  </th>

                  <th className="text-left p-4">
                    Total
                  </th>

                  <th className="text-left p-4">
                    Fecha
                  </th>

                  <th className="text-left p-4">
                    Estado
                  </th>

                  <th className="text-left p-4">
                    Detalle
                  </th>

                </tr>

              </thead>

              <tbody>

                {pedidos.map(
                  (pedido) => (

                  <tr
                    key={
                      pedido.id_pedido
                    }
                    className="border-t"
                  >

                    {/* CLIENTE */}
                    <td className="p-4 font-semibold">
                      {
                        pedido.usuario_nombre
                      }
                    </td>

                    {/* DIRECCION */}
                    <td className="p-4 text-gray-600">
                      {
                        pedido.direccion_envio
                      }
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-bold text-primary">
                      $
                      {pedido.total}
                    </td>

                    {/* FECHA */}
                    <td className="p-4 text-gray-500">

                      {new Date(
                        pedido.fecha
                      ).toLocaleDateString()}

                    </td>

                    {/* ESTADO */}
                    <td className="p-4">

                      <select
                        value={
                          pedido.estado
                        }
                        onChange={(e) =>
                          cambiarEstado(
                            pedido.id_pedido,
                            e.target.value
                          )
                        }
                        className="border rounded-xl px-3 py-2"
                      >

                        <option value="pendiente">
                          Pendiente
                        </option>

                        <option value="pagado">
                          Pagado
                        </option>

                        <option value="enviado">
                          Enviado
                        </option>

                        <option value="entregado">
                          Entregado
                        </option>

                      </select>

                    </td>

                    {/* DETALLE */}
                    <td className="p-4">

                      <button
                        onClick={() =>
                          verDetallePedido(
                            pedido.id_pedido
                          )
                        }
                        className="bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                      >
                        Ver detalle
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* MODAL DETALLE */}
      {/* ===================================== */}

      {showModal && detallePedido && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">

          <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold">
                  Pedido #
                  {detallePedido.id_pedido}
                </h2>

                <p className="text-gray-500 mt-2">
                  Detalle completo del pedido
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-3xl hover:scale-110 transition"
              >
                ✕
              </button>

            </div>

            {/* PRODUCTOS */}
            <div className="space-y-6">

              {detallePedido.productos?.map(
                (producto: ProductoDetalle) => (

                <div
                  key={producto.id_producto}
                  className="flex items-center gap-5 border-b pb-6"
                >

                  {/* IMAGEN */}
                  {producto.imagen_url && (

                    <Image
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  )}

                  {/* INFO */}
                  <div className="flex-1">

                    <h3 className="font-bold text-xl">
                      {producto.nombre}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Cantidad:
                      {" "}
                      {producto.cantidad}
                    </p>

                    <p className="text-primary font-bold mt-2">
                      $
                      {producto.precio_unitario}
                    </p>

                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-right">

                    <p className="font-bold text-2xl">

                      $
                      {producto.precio_unitario *
                        producto.cantidad}

                    </p>

                  </div>

                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-10 text-right border-t pt-6">

              <h3 className="text-4xl font-bold text-primary">

                Total:
                {" "}
                $
                {detallePedido.total}

              </h3>

            </div>

          </div>

        </div>
      )}
    </>
  );
}