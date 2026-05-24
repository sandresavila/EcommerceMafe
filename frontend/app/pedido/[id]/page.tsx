"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  useParams,
} from "next/navigation";

import {
  Package,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

interface ProductoPedido {

  id_producto: number;

  nombre: string;

  imagen_url: string;

  cantidad: number;

  precio_unitario: number;
}

interface PedidoDetalle {

  id_pedido: number;

  total: number;

  estado: string;

  direccion_envio: string;

  fecha: string;

  productos: ProductoPedido[];
}

export default function PedidoDetallePage() {

  const { token } =
    useAuth();

  const params =
    useParams();

  const [pedido,
    setPedido] =
      useState<PedidoDetalle | null>(null);

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // FETCH PEDIDO
  // =====================================

  useEffect(() => {

    const fetchPedido =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${params.id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setPedido(
            response.data
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando pedido"
          );

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchPedido();
    }

  }, [token, params.id]);

  // =====================================
  // ESTADO COLOR
  // =====================================

  const estadoColor =
    (estado: string) => {

      switch (estado) {

        case "pendiente":
          return "bg-yellow-100 text-yellow-700";

        case "pagado":
          return "bg-blue-100 text-blue-700";

        case "enviado":
          return "bg-purple-100 text-purple-700";

        case "entregado":
          return "bg-green-100 text-green-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando pedido...
      </div>
    );
  }

  // =====================================
  // NO PEDIDO
  // =====================================

  if (!pedido) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Pedido no encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-14 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-[2rem] shadow-lg p-10 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-lg">

                  <Package className="w-8 h-8" />

                </div>

                <div>

                  <h1 className="text-4xl font-black">

                    Pedido #
                    {pedido.id_pedido}

                  </h1>

                  <p className="text-gray-500 mt-2">
                    Detalle completo del pedido
                  </p>

                </div>

              </div>

              {/* INFO */}
              <div className="mt-8 space-y-4">

                {/* FECHA */}
                <div className="flex items-center gap-3 text-gray-600">

                  <CalendarDays className="w-5 h-5 text-primary" />

                  {new Date(
                    pedido.fecha
                  ).toLocaleDateString(
                    "es-CO",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}

                </div>

                {/* DIRECCION */}
                <div className="flex items-center gap-3 text-gray-600">

                  <MapPin className="w-5 h-5 text-primary" />

                  {pedido.direccion_envio}

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start lg:items-end">

              <span
                className={`px-5 py-3 rounded-full text-sm font-semibold capitalize
                ${
                  estadoColor(
                    pedido.estado
                  )
                }`}
              >

                {pedido.estado}

              </span>

              <h2 className="text-5xl font-black text-primary mt-6">

                $
                {pedido.total.toLocaleString(
                  "es-CO"
                )}

              </h2>

              <p className="text-gray-500 mt-2">
                Total del pedido
              </p>

            </div>

          </div>

        </div>

        {/* PRODUCTOS */}
        <div className="space-y-6">

          {pedido.productos.map(
            (producto) => (

            <div
              key={producto.id_producto}
              className="bg-white rounded-[2rem] shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
            >

              {/* IMAGEN */}
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100">

                {producto.imagen_url && (

                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                )}

              </div>

              {/* INFO */}
              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {producto.nombre}
                </h2>

                <p className="text-gray-500 mt-3">

                  Cantidad:
                  {" "}
                  {producto.cantidad}

                </p>

                <p className="text-gray-500 mt-1">

                  Precio unitario:
                  {" "}

                  $
                  {producto.precio_unitario.toLocaleString(
                    "es-CO"
                  )}

                </p>

              </div>

              {/* SUBTOTAL */}
              <div className="text-right">

                <p className="text-gray-500 text-sm">
                  Subtotal
                </p>

                <h3 className="text-3xl font-black text-primary mt-2">

                  $
                  {(
                    producto.precio_unitario *
                    producto.cantidad
                  ).toLocaleString(
                    "es-CO"
                  )}

                </h3>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}