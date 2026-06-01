"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import {
  ShoppingBag,
  Package,
  ChevronRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

import OrderStatus
  from "@/components/OrderStatus";

interface Pedido {

  id_pedido: number;

  total: number;

  estado: string;

  fecha: string;

  direccion_envio: string;
}

export default function MisPedidosPage() {

  const {
    token,
  } = useAuth();

  const [pedidos,
    setPedidos] =
      useState<Pedido[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  // =====================================
  // FETCH PEDIDOS
  // =====================================

  useEffect(() => {

    const fetchPedidos =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/pedidos/mis-pedidos`,
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

          toast.error(
            "Error cargando pedidos"
          );

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchPedidos();

    } else {

      setLoading(false);
    }

  }, [token]);

  // =====================================
  // COLOR ESTADO
  // =====================================

  const estadoColor =
    (estado: string) => {

      switch (estado) {

        case "pendiente":
          return "bg-yellow-100 text-yellow-700";

        case "pagado":
          return "bg-blue-100 text-blue-700";

        case "preparando":
          return "bg-indigo-100 text-indigo-700";

        case "enviado":
          return "bg-purple-100 text-purple-700";

        case "entregado":
          return "bg-green-100 text-green-700";

        case "cancelado":
          return "bg-red-100 text-red-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
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

            Cargando pedidos...

          </p>

        </div>

      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden px-4 md:px-8 py-14">

      <div className="max-w-6xl mx-auto">

        {/* ===================================== */}
        {/* HERO */}
        {/* ===================================== */}

        <section className="text-center mb-16 fade-in">

          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold mb-6">

            <Sparkles className="w-5 h-5" />

            Historial de compras

          </div>

          <h1 className="text-4xl md:text-6xl font-black text-dark">

            Mis pedidos

          </h1>

          <p className="text-gray-500 text-lg mt-5 max-w-2xl mx-auto">

            Consulta el estado de tus compras y
            haz seguimiento a todos tus pedidos.

          </p>

        </section>

        {/* ===================================== */}
        {/* EMPTY */}
        {/* ===================================== */}

        {pedidos.length === 0 ? (

          <div className="bg-white rounded-[2.5rem] shadow-2xl p-14 md:p-20 text-center zoom-in">

            <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-10">

              <Package className="w-16 h-16 text-primary" />

            </div>

            <h2 className="text-4xl font-black text-dark">

              No tienes pedidos aún

            </h2>

            <p className="text-gray-500 mt-5 text-lg max-w-xl mx-auto leading-relaxed">

              Explora nuestro catálogo y realiza tu primera compra
              para ver aquí el historial de pedidos.

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
            {/* STATS */}
            {/* ===================================== */}

            <div className="grid md:grid-cols-3 gap-6 mb-10">

              {/* TOTAL */}
              <div className="bg-white rounded-[2rem] shadow-xl p-7">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500">

                      Total pedidos

                    </p>

                    <h2 className="text-5xl font-black mt-3 text-dark">

                      {pedidos.length}

                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                    <ShoppingBag className="w-8 h-8" />

                  </div>

                </div>

              </div>

              {/* EN PROCESO */}
              <div className="bg-white rounded-[2rem] shadow-xl p-7">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500">

                      En proceso

                    </p>

                    <h2 className="text-5xl font-black mt-3 text-indigo-600">

                      {
                        pedidos.filter(
                          (p) =>
                            p.estado === "pendiente" ||
                            p.estado === "pagado" ||
                            p.estado === "preparando"
                        ).length
                      }

                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">

                    <Clock3 className="w-8 h-8" />

                  </div>

                </div>

              </div>

              {/* ENTREGADOS */}
              <div className="bg-white rounded-[2rem] shadow-xl p-7">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500">

                      Entregados

                    </p>

                    <h2 className="text-5xl font-black mt-3 text-green-600">

                      {
                        pedidos.filter(
                          (p) =>
                            p.estado === "entregado"
                        ).length
                      }

                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                    <Truck className="w-8 h-8" />

                  </div>

                </div>

              </div>

            </div>

            {/* ===================================== */}
            {/* LIST */}
            {/* ===================================== */}

            <div className="space-y-8">

              {pedidos.map(
                (pedido) => (

                <div
                  key={
                    pedido.id_pedido
                  }
                  className="group bg-white rounded-[2.5rem] shadow-xl border border-white overflow-hidden hover:shadow-2xl transition duration-300"
                >

                  {/* TOP */}
                  <div className="p-5 sm:p-8 md:p-10">

                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">

                      {/* LEFT */}
                      <div className="flex items-start gap-5">

                        {/* ICON */}
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">

                          <Package className="w-10 h-10" />

                        </div>

                        {/* DATA */}
                        <div>

                          <div className="flex flex-wrap items-center gap-4">

                            <h2 className="text-3xl font-black text-dark">

                              Pedido #
                              {pedido.id_pedido}

                            </h2>

                            <span
                              className={`px-5 py-2 rounded-full text-sm font-bold capitalize
                              ${
                                estadoColor(
                                  pedido.estado
                                )
                              }`}
                            >

                              {pedido.estado}

                            </span>

                          </div>

                          <p className="text-gray-500 mt-4 text-lg">

                            Realizado el
                            {" "}

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

                          </p>

                          {/* DIRECCION */}
                          <div className="mt-5 bg-gray-50 rounded-2xl px-5 py-4 max-w-2xl">

                            <p className="text-sm text-gray-500 font-semibold mb-2">

                              Dirección de envío

                            </p>

                            <p className="text-gray-700 leading-relaxed">

                              📍
                              {" "}
                              {pedido.direccion_envio}

                            </p>

                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col items-start xl:items-end gap-5">

                        {/* TOTAL */}
                        <div className="text-left xl:text-right">

                          <p className="text-gray-400 text-sm uppercase tracking-wide">

                            Total del pedido

                          </p>

                          <h3 className="text-4xl font-black text-primary mt-2">

                            $
                            {Number(
                              pedido.total
                            ).toLocaleString(
                              "es-CO"
                            )}

                          </h3>

                        </div>

                        {/* BTN */}
                        <Link
                          href={`/mis-pedidos/${pedido.id_pedido}`}
                        >

                          <button className="bg-primary hover:scale-105 transition text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl">

                            Ver detalle

                            <ChevronRight className="w-5 h-5" />

                          </button>

                        </Link>

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="border-t border-gray-100 px-5 sm:px-8 md:px-10 py-6 md:py-8 bg-gray-50/70">

                    <div className="flex items-center gap-3 mb-6">

                      <ShieldCheck className="w-5 h-5 text-primary" />

                      <h3 className="font-bold text-lg text-dark">

                        Estado del pedido

                      </h3>

                    </div>

                    <div className="overflow-x-auto pb-2">

                      <div className="min-w-[650px]">

                        <OrderStatus
                          estado={pedido.estado}
                        />

                      </div>

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
