"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  ShoppingBag,
  Eye,
  Search,
  DollarSign,
  Clock3,
  XCircle,
  X,
} from "lucide-react";

import OrderStatus
  from "@/components/OrderStatus";

interface Pedido {

  id_pedido: number;

  usuario_nombre: string;

  usuario_correo?: string;

  usuario_telefono?: string;

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

  estado: string;

  direccion_envio: string;

  fecha: string;

  productos: ProductoDetalle[];

  usuario?: {
    nombre: string;
    correo: string;
    telefono: string;
  } | null;
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

  const [busqueda,
    setBusqueda] =
      useState("");

  const [filtroEstado,
    setFiltroEstado] =
      useState("todos");

  const [fechaDesde,
    setFechaDesde] =
      useState("");

  const [fechaHasta,
    setFechaHasta] =
      useState("");

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
  // FETCH PEDIDOS
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

          toast.error(
            "Error cargando pedidos"
          );

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchPedidos();
    }

  }, [token]);

  // =====================================
  // FILTROS
  // =====================================

  const pedidosFiltrados =
    useMemo(() => {

      return pedidos.filter(
        (pedido) => {

          const texto =
            busqueda.toLowerCase();

          const matchBusqueda =

            pedido.usuario_nombre
              .toLowerCase()
              .includes(texto) ||

            pedido.id_pedido
              .toString()
              .includes(texto);

          const matchEstado =

            filtroEstado === "todos"
              ? true
              : pedido.estado ===
                filtroEstado;

          const fechaPedido =
            new Date(pedido.fecha);

          const matchFechaDesde =
            fechaDesde
              ? fechaPedido >=
                new Date(`${fechaDesde}T00:00:00`)
              : true;

          const matchFechaHasta =
            fechaHasta
              ? fechaPedido <=
                new Date(`${fechaHasta}T23:59:59`)
              : true;

          return (
            matchBusqueda &&
            matchEstado &&
            matchFechaDesde &&
            matchFechaHasta
          );
        }
      );

    }, [
      pedidos,
      busqueda,
      filtroEstado,
      fechaDesde,
      fechaHasta,
    ]);

  // =====================================
  // DETALLE PEDIDO
  // =====================================

  const abrirDetalle =
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

        toast.error(
          "Error cargando detalle"
        );
      }
    };

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
          { estado },
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

        // ACTUALIZAR MODAL
        if (
          detallePedido &&
          detallePedido.id_pedido === id
        ) {

          setDetallePedido({
            ...detallePedido,
            estado,
          });
        }

        toast.success(
          "Estado actualizado"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando estado"
        );
      }
    };

  // =====================================
  // EXPORT CSV
  // =====================================

  const exportarCSV = () => {

    const headers = [
      "ID",
      "Cliente",
      "Correo",
      "Telefono",
      "Estado",
      "Total",
      "Direccion",
      "Fecha",
    ];

    const rows =
      pedidosFiltrados.map(
        (pedido) => [
          pedido.id_pedido,
          pedido.usuario_nombre,
          pedido.usuario_correo || "",
          pedido.usuario_telefono || "",
          pedido.estado,
          pedido.total,
          pedido.direccion_envio,
          new Date(
            pedido.fecha
          ).toLocaleDateString(
            "es-CO"
          ),
        ]
      );

    const csvContent =
      [headers, ...rows]
        .map((e) =>
          e.map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          ).join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "pedidos.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  const limpiarFiltros =
    () => {

      setBusqueda("");

      setFiltroEstado("todos");

      setFechaDesde("");

      setFechaHasta("");
  };

  // =====================================
  // STATS
  // =====================================

  const totalVentas =
    pedidos.reduce(
      (acc, pedido) =>
        acc + Number(pedido.total),
      0
    );

  const pendientes =
    pedidos.filter(
      (p) =>
        p.estado ===
        "pendiente"
    ).length;

  const cancelados =
    pedidos.filter(
      (p) =>
        p.estado ===
        "cancelado"
    ).length;

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

    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900">

              Pedidos

            </h1>

            <p className="text-gray-500 mt-3 text-lg">

              Gestión avanzada de pedidos, estados y ventas

            </p>

          </div>

          <button
            onClick={exportarCSV}
            className="bg-primary text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
          >

            Exportar CSV

          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {/* PEDIDOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Pedidos
                </p>

                <h2 className="text-5xl font-black mt-3">

                  {pedidos.length}

                </h2>

              </div>

              <ShoppingBag className="w-10 h-10 text-primary" />

            </div>

          </div>

          {/* PENDIENTES */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Pendientes
                </p>

                <h2 className="text-5xl font-black mt-3 text-yellow-500">

                  {pendientes}

                </h2>

              </div>

              <Clock3 className="w-10 h-10 text-yellow-500" />

            </div>

          </div>

          {/* VENTAS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Ventas
                </p>

                <h2 className="text-3xl font-black mt-3 text-green-600">

                  $
                  {Number(totalVentas).toLocaleString(
                    "es-CO"
                  )}

                </h2>

              </div>

              <DollarSign className="w-10 h-10 text-green-600" />

            </div>

          </div>

          {/* CANCELADOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Cancelados
                </p>

                <h2 className="text-5xl font-black mt-3 text-red-500">

                  {cancelados}

                </h2>

              </div>

              <XCircle className="w-10 h-10 text-red-500" />

            </div>

          </div>

        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-[2rem] shadow-lg p-6 mb-8">

          <div className="grid lg:grid-cols-[1fr_180px_170px_170px_auto] gap-4">

            {/* SEARCH */}
            <div className="flex-1 relative">

              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Buscar pedido o cliente..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full pl-12 pr-4 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

            {/* ESTADO */}
            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value
                )
              }
              className="px-5 py-4 border rounded-2xl outline-none"
            >

              <option value="todos">
                Todos
              </option>

              <option value="pendiente">
                Pendiente
              </option>

              <option value="pagado">
                Pagado
              </option>

              <option value="preparando">
                Preparando
              </option>

              <option value="enviado">
                Enviado
              </option>

              <option value="entregado">
                Entregado
              </option>

              <option value="cancelado">
                Cancelado
              </option>

            </select>

            <input
              type="date"
              value={fechaDesde}
              onChange={(e) =>
                setFechaDesde(e.target.value)
              }
              className="px-5 py-4 border rounded-2xl outline-none"
            />

            <input
              type="date"
              value={fechaHasta}
              onChange={(e) =>
                setFechaHasta(e.target.value)
              }
              className="px-5 py-4 border rounded-2xl outline-none"
            />

            <button
              onClick={limpiarFiltros}
              className="px-5 py-4 rounded-2xl border font-semibold text-gray-600 hover:bg-gray-50"
            >
              Limpiar
            </button>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </p>

        </div>

        {/* TABLA */}
        <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-5">
                    Pedido
                  </th>

                  <th className="text-left p-5">
                    Cliente
                  </th>

                  <th className="text-left p-5">
                    Total
                  </th>

                  <th className="text-left p-5 min-w-[350px]">
                    Estado
                  </th>

                  <th className="text-left p-5">
                    Fecha
                  </th>

                  <th className="text-left p-5">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {pedidosFiltrados.map(
                  (pedido) => (

                  <tr
                    key={pedido.id_pedido}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-5 font-bold text-primary">

                      #{pedido.id_pedido}

                    </td>

                    <td className="p-5 font-semibold">

                      {pedido.usuario_nombre}

                    </td>

                    <td className="p-5 font-bold text-green-600">

                      $
                      {Number(pedido.total).toLocaleString(
                        "es-CO"
                      )}

                    </td>

                    <td className="p-5 min-w-[350px]">

                      <div className="flex flex-col gap-4">

                        <OrderStatus
                          estado={pedido.estado}
                        />

                        <select
                          value={pedido.estado}
                          onChange={(e) =>
                            cambiarEstado(
                              pedido.id_pedido,
                              e.target.value
                            )
                          }
                          className="border rounded-xl px-3 py-2 text-sm"
                        >

                          <option value="pendiente">
                            Pendiente
                          </option>

                          <option value="pagado">
                            Pagado
                          </option>

                          <option value="preparando">
                            Preparando
                          </option>

                          <option value="enviado">
                            Enviado
                          </option>

                          <option value="entregado">
                            Entregado
                          </option>

                          <option value="cancelado">
                            Cancelado
                          </option>

                        </select>

                      </div>

                    </td>

                    <td className="p-5 text-gray-500">

                      {new Date(
                        pedido.fecha
                      ).toLocaleDateString(
                        "es-CO"
                      )}

                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          abrirDetalle(
                            pedido.id_pedido
                          )
                        }
                        className="bg-primary text-white p-3 rounded-xl hover:scale-105 transition"
                      >

                        <Eye className="w-5 h-5" />

                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showModal && detallePedido && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">

          <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl max-h-[95vh] overflow-y-auto">

            {/* HEADER */}
            <div className="p-6 md:p-8 border-b flex items-start justify-between">

                        <div>

                <h2 className="text-3xl md:text-4xl font-black">

                  Pedido #{detallePedido.id_pedido}

                </h2>

                <p className="text-gray-500 mt-2">

                  Detalle completo del pedido

                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-500 hover:text-black transition"
              >

                <X className="w-7 h-7" />

              </button>

            </div>

            {/* BODY */}
            <div className="p-6 md:p-8 space-y-8">

              {/* ESTADO */}
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 overflow-hidden">

                <div className="mb-8">

                  <h3 className="font-black text-3xl">

                    Estado del pedido

                  </h3>

                  <p className="text-gray-500 mt-2">

                    Seguimiento actualizado en tiempo real

                  </p>

                </div>

                <div className="overflow-x-auto pb-2">

                  <div className="min-w-[700px]">

                    <OrderStatus
                      estado={detallePedido.estado}
                    />

                  </div>

                </div>

              </div>

              {/* TOTAL + FECHA */}
              <div className="grid lg:grid-cols-2 gap-6">

                {/* TOTAL */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">

                  <p className="text-lg font-medium opacity-90">
                    Total del pedido
                  </p>

                  <h3 className="text-5xl font-black mt-4">

                    $
                    {Number(detallePedido.total).toLocaleString(
                      "es-CO"
                    )}

                  </h3>

                  <p className="mt-5 opacity-90">
                    Pago registrado correctamente
                  </p>

                </div>

                {/* FECHA */}
                <div className="bg-gray-50 rounded-3xl p-8">

                  <p className="text-gray-500 font-medium">
                    Fecha del pedido
                  </p>

                  <h3 className="text-3xl font-black mt-4">

                    {new Date(
                      detallePedido.fecha
                    ).toLocaleDateString(
                      "es-CO",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}

                  </h3>

                  <p className="text-gray-500 mt-3">
                    {new Date(
                      detallePedido.fecha
                    ).toLocaleTimeString(
                      "es-CO"
                    )}
                  </p>

                </div>

              </div>

              {/* DIRECCION */}
              <div className="bg-gray-50 rounded-3xl p-8">

                <h3 className="font-black text-2xl mb-4">

                  Dirección de envío

                </h3>

                <p className="text-gray-600 leading-relaxed text-lg">

                  {detallePedido.direccion_envio}

                </p>

              </div>

              {detallePedido.usuario && (
                <div className="bg-gray-50 rounded-3xl p-8">

                  <h3 className="font-black text-2xl mb-4">
                    Datos del cliente
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                    <div>
                      <p className="text-sm text-gray-400">Nombre</p>
                      <p className="font-semibold">{detallePedido.usuario.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Correo</p>
                      <p className="font-semibold break-all">{detallePedido.usuario.correo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="font-semibold">{detallePedido.usuario.telefono || "-"}</p>
                    </div>
                  </div>

                  {detallePedido.usuario.telefono && (
                    <a
                      href={`https://wa.me/57${detallePedido.usuario.telefono.replace(/\D/g, "").replace(/^57/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
                    >
                      Contactar por WhatsApp
                    </a>
                  )}

                </div>
              )}

              {/* PRODUCTOS */}
              <div>

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h3 className="font-black text-3xl">

                      Productos

                    </h3>

                    <p className="text-gray-500 mt-1">

                      Productos incluidos en el pedido

                    </p>

                  </div>

                  <div className="bg-primary/10 text-primary px-5 py-2 rounded-2xl font-bold">

                    {detallePedido.productos.length}
                    {" "}
                    productos

                  </div>

                </div>

                <div className="space-y-4">

                  {detallePedido.productos.map(
                    (producto) => (

                    <div
                      key={producto.id_producto}
                      className="flex flex-col md:flex-row md:items-center gap-5 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition"
                    >

                      {/* IMAGEN */}
                      <div className="w-28 h-28 relative rounded-2xl overflow-hidden bg-gray-100 shrink-0">

                        <Image
                          src={
                            producto.imagen_url ||
                            "/placeholder.png"
                          }
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />

                      </div>

                      {/* INFO */}
                      <div className="flex-1">

                        <h4 className="font-black text-2xl">

                          {producto.nombre}

                        </h4>

                        <div className="flex flex-wrap gap-3 mt-4">

                          <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium">

                            Cantidad:
                            {" "}
                            {producto.cantidad}

                          </span>

                          <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold">

                            Precio unitario:
                            {" "}
                            $
                            {Number(
                              producto.precio_unitario
                            ).toLocaleString(
                              "es-CO"
                            )}

                          </span>

                        </div>

                      </div>

                      {/* PRECIO */}
                      <div className="text-left md:text-right">

                        <p className="text-gray-400 text-sm">
                          Subtotal
                        </p>

                        <p className="font-black text-3xl text-primary mt-1">

                          $
                          {(
                            Number(
                              producto.precio_unitario
                            ) *
                            producto.cantidad
                          ).toLocaleString(
                            "es-CO"
                          )}

                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
