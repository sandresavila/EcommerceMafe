"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock3,
  DollarSign,
  Folder,
  Gauge,
  Package,
  PackageSearch,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

interface DashboardData {

  totalProductos: number;

  totalPedidos: number;

  totalUsuarios: number;

  totalVentas: number;

  ventasMes: number;

  ventasHoy: number;

  ticketPromedio: number;

  pedidosPendientes: number;

  pedidosPorEstado: {
    estado: string;
    total: number;
  }[];

  topProductos: {
    id_producto: number;
    nombre: string;
    imagen_url: string | null;
    unidades_vendidas: number;
    total_vendido: number;
  }[];

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

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }
  );

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(
    "es-CO",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

export default function AdminDashboardPage() {

  const { token } =
    useAuth();

  const [data,
    setData] =
      useState<DashboardData | null>(null);

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const fetchDashboard =
    useCallback(
    async () => {

      if (!token) return;

      try {

        setRefreshing(true);

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

        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);

  const health =
    useMemo(() => {

      if (!data) return 0;

      if (data.totalProductos === 0) return 100;

      const productosConAlerta =
        data.productosStockBajo.length +
        data.productosAgotados.length;

      return Math.max(
        0,
        Math.round(
          ((data.totalProductos - productosConAlerta) /
            data.totalProductos) *
            100
        )
      );

    }, [data]);

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="h-40 rounded-3xl bg-white shadow-sm animate-pulse" />
      </div>
    );
  }

  if (!data) {

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          No se pudo cargar el dashboard.
        </div>
      </div>
    );
  }

  const estadosOrdenados = [
    "pendiente",
    "pagado",
    "preparando",
    "enviado",
    "entregado",
    "cancelado",
  ];

  const totalEstados =
    data.pedidosPorEstado.reduce(
      (acc, item) =>
        acc + Number(item.total),
      0
    );

  const getEstadoTotal =
    (estado: string) =>
      Number(
        data.pedidosPorEstado.find(
          (item) =>
            item.estado === estado
        )?.total || 0
      );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto space-y-8">

        <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Activity className="w-4 h-4" />
                Centro de control
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
                Dashboard administrativo
              </h1>

              <p className="mt-3 max-w-3xl text-gray-500 text-lg">
                Vista general para ventas, pedidos, inventario y actividad reciente de MAFE Beauty.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={fetchDashboard}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </button>

              <Link
                href="/admin/productos"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-lg hover:opacity-90"
              >
                <Package className="w-5 h-5" />
                Nuevo producto
              </Link>

            </div>

          </div>

        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {[
            {
              label: "Ventas totales",
              value: formatCurrency(data.totalVentas),
              detail: `${data.totalPedidos} pedidos registrados`,
              icon: DollarSign,
              color: "text-green-600 bg-green-100",
            },
            {
              label: "Ventas del mes",
              value: formatCurrency(data.ventasMes),
              detail: `${formatCurrency(data.ventasHoy)} vendidos hoy`,
              icon: TrendingUp,
              color: "text-blue-600 bg-blue-100",
            },
            {
              label: "Ticket promedio",
              value: formatCurrency(data.ticketPromedio),
              detail: "Promedio por pedido",
              icon: BarChart3,
              color: "text-purple-600 bg-purple-100",
            },
            {
              label: "Salud de inventario",
              value: `${health}%`,
              detail: `${data.productosStockBajo.length + data.productosAgotados.length} alertas activas`,
              icon: Gauge,
              color: "text-primary bg-primary/10",
            },
          ].map((metric) => {

            const Icon =
              metric.icon;

            return (
              <article
                key={metric.label}
                className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100"
              >

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-sm font-semibold text-gray-500">
                      {metric.label}
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-gray-900">
                      {metric.value}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {metric.detail}
                    </p>

                  </div>

                  <div className={`rounded-2xl p-3 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                </div>

              </article>
            );
          })}

        </section>

        <section className="grid xl:grid-cols-[1.15fr_0.85fr] gap-6">

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between gap-4 mb-6">

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Pedidos por estado
                </h2>
                <p className="mt-1 text-gray-500">
                  Distribución actual del flujo de ventas
                </p>
              </div>

              <Link
                href="/admin/pedidos"
                className="hidden md:inline-flex items-center gap-2 text-primary font-semibold"
              >
                Ver pedidos
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

            <div className="space-y-4">

              {estadosOrdenados.map((estado) => {

                const total =
                  getEstadoTotal(estado);

                const percent =
                  totalEstados === 0
                    ? 0
                    : Math.round(
                        (total / totalEstados) *
                          100
                      );

                return (
                  <div key={estado}>

                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="capitalize text-gray-700">
                        {estadoLabels[estado]}
                      </span>
                      <span className="text-gray-500">
                        {total} pedidos
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">

            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-600">
                <Clock3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Prioridad de hoy
                </h2>
                <p className="text-gray-500">
                  Acciones que necesitan atención
                </p>
              </div>
            </div>

            <div className="space-y-3">

              <Link
                href="/admin/pedidos"
                className="flex items-center justify-between rounded-2xl bg-yellow-50 p-4 text-yellow-800 border border-yellow-100"
              >
                <span className="font-semibold">
                  Pedidos pendientes
                </span>
                <strong>{data.pedidosPendientes}</strong>
              </Link>

              <Link
                href="/admin/productos"
                className="flex items-center justify-between rounded-2xl bg-orange-50 p-4 text-orange-800 border border-orange-100"
              >
                <span className="font-semibold">
                  Productos con stock bajo
                </span>
                <strong>{data.productosStockBajo.length}</strong>
              </Link>

              <Link
                href="/admin/productos"
                className="flex items-center justify-between rounded-2xl bg-red-50 p-4 text-red-800 border border-red-100"
              >
                <span className="font-semibold">
                  Productos agotados
                </span>
                <strong>{data.productosAgotados.length}</strong>
              </Link>

            </div>

          </div>

        </section>

        <section className="grid xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">

            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900">
                Últimos pedidos
              </h2>
              <p className="mt-1 text-gray-500">
                Actividad reciente de la tienda
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-5">Pedido</th>
                    <th className="text-left p-5">Cliente</th>
                    <th className="text-left p-5">Total</th>
                    <th className="text-left p-5">Estado</th>
                    <th className="text-left p-5">Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {data.ultimosPedidos.map((pedido) => (
                    <tr
                      key={pedido.id_pedido}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-5 font-black text-primary">
                        #{pedido.id_pedido}
                      </td>
                      <td className="p-5 font-semibold text-gray-900">
                        {pedido.usuario_nombre}
                      </td>
                      <td className="p-5 font-bold text-green-600">
                        {formatCurrency(pedido.total)}
                      </td>
                      <td className="p-5">
                        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                          {estadoLabels[pedido.estado] || pedido.estado}
                        </span>
                      </td>
                      <td className="p-5 text-gray-500">
                        {formatDate(pedido.fecha)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">

            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <PackageSearch className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Más vendidos
                </h2>
                <p className="text-gray-500">
                  Top por unidades
                </p>
              </div>
            </div>

            <div className="space-y-4">

              {data.topProductos.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-5 text-gray-500">
                  Aún no hay ventas suficientes.
                </div>
              ) : (
                data.topProductos.map((producto, index) => (
                  <div
                    key={producto.id_producto}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-gray-900">
                        {producto.nombre}
                      </p>
                      <p className="text-sm text-gray-500">
                        {producto.unidades_vendidas} unidades
                      </p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatCurrency(producto.total_vendido)}
                    </p>
                  </div>
                ))
              )}

            </div>

          </div>

        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {[
            {
              href: "/admin/productos",
              title: "Productos",
              text: "Administrar catálogo y stock",
              icon: Package,
            },
            {
              href: "/admin/pedidos",
              title: "Pedidos",
              text: "Revisar ventas y estados",
              icon: ShoppingCart,
            },
            {
              href: "/admin/categorias",
              title: "Categorías",
              text: "Organizar el catálogo",
              icon: Folder,
            },
            {
              href: "/admin/usuarios",
              title: "Usuarios",
              text: "Gestionar clientes y roles",
              icon: Users,
            },
          ].map((action) => {

            const Icon =
              action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-gray-100 p-3 text-gray-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="mt-5 text-xl font-black text-gray-900">
                  {action.title}
                </h3>
                <p className="mt-2 text-gray-500">
                  {action.text}
                </p>
              </Link>
            );
          })}

        </section>

        <section className="grid lg:grid-cols-2 gap-6">

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-black text-gray-900">
                Stock bajo
              </h2>
            </div>
            <div className="space-y-3">
              {data.productosStockBajo.length === 0 ? (
                <p className="rounded-2xl bg-green-50 p-4 font-semibold text-green-700">
                  Todo el stock está correcto.
                </p>
              ) : (
                data.productosStockBajo.slice(0, 5).map((producto) => (
                  <div
                    key={producto.id_producto}
                    className="flex items-center justify-between rounded-2xl bg-orange-50 p-4 text-orange-800"
                  >
                    <span className="font-semibold">{producto.nombre}</span>
                    <span className="font-black">{producto.stock}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <XCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-black text-gray-900">
                Agotados
              </h2>
            </div>
            <div className="space-y-3">
              {data.productosAgotados.length === 0 ? (
                <p className="rounded-2xl bg-green-50 p-4 font-semibold text-green-700">
                  No hay productos agotados.
                </p>
              ) : (
                data.productosAgotados.slice(0, 5).map((producto) => (
                  <div
                    key={producto.id_producto}
                    className="flex items-center justify-between rounded-2xl bg-red-50 p-4 text-red-800"
                  >
                    <span className="font-semibold">{producto.nombre}</span>
                    <Boxes className="w-5 h-5" />
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {health >= 90 && data.pedidosPendientes === 0 && (
          <section className="flex items-center gap-4 rounded-3xl bg-green-50 p-6 text-green-800 border border-green-100">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <p className="font-semibold">
              La operación está al día: inventario saludable y sin pedidos pendientes.
            </p>
          </section>
        )}

      </div>

    </div>
  );
}
