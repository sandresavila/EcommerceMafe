"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Download,
  Lock,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  Usuario,
} from "@/types/auth";

const formatDate =
  (value?: string) =>
    value
      ? new Date(value).toLocaleDateString(
          "es-CO",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "-";

export default function AdminUsuariosPage() {

  const {
    token,
    usuario: usuarioActual,
  } = useAuth();

  const [usuarios,
    setUsuarios] =
      useState<Usuario[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  const [busqueda,
    setBusqueda] =
      useState("");

  const [filtroRol,
    setFiltroRol] =
      useState("todos");

  const [filtroEstado,
    setFiltroEstado] =
      useState("todos");

  useEffect(() => {

    const fetchUsuarios =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/usuarios`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setUsuarios(
            response.data
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando usuarios"
          );

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchUsuarios();
    }

  }, [token]);

  const usuariosFiltrados =
    useMemo(() => {

      return usuarios.filter(
        (usuario) => {

          const texto =
            busqueda.toLowerCase();

          const matchBusqueda =
            usuario.nombre
              .toLowerCase()
              .includes(texto) ||
            usuario.correo
              .toLowerCase()
              .includes(texto) ||
            (usuario.telefono || "")
              .toLowerCase()
              .includes(texto);

          const matchRol =
            filtroRol === "todos"
              ? true
              : usuario.rol === filtroRol;

          const matchEstado =
            filtroEstado === "todos"
              ? true
              : filtroEstado === "activos"
              ? !!usuario.activo
              : !usuario.activo;

          return (
            matchBusqueda &&
            matchRol &&
            matchEstado
          );
        }
      );

    }, [
      usuarios,
      busqueda,
      filtroRol,
      filtroEstado,
    ]);

  const totalAdmins =
    usuarios.filter(
      (u) =>
        u.rol === "admin"
    ).length;

  const totalActivos =
    usuarios.filter(
      (u) =>
        u.activo
    ).length;

  const totalBloqueados =
    usuarios.length -
    totalActivos;

  const cambiarRol =
    async (
      id_usuario: number,
      rol: string
    ) => {

      if (
        usuarioActual?.id_usuario ===
        id_usuario
      ) {

        toast.warning(
          "No puedes cambiar tu propio rol"
        );

        return;
      }

      try {

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id_usuario}/rol`,
          { rol },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id_usuario === id_usuario
              ? {
                  ...usuario,
                  rol,
                }
              : usuario
          )
        );

        toast.success(
          "Rol actualizado"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando rol"
        );
      }
    };

  const toggleUsuario =
    async (
      usuario: Usuario
    ) => {

      if (
        usuarioActual?.id_usuario ===
        usuario.id_usuario
      ) {

        toast.warning(
          "No puedes bloquear tu propio usuario"
        );

        return;
      }

      try {

        const endpoint =
          usuario.activo
            ? "bloquear"
            : "activar";

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario.id_usuario}/${endpoint}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setUsuarios((prev) =>
          prev.map((item) =>
            item.id_usuario === usuario.id_usuario
              ? {
                  ...item,
                  activo:
                    !usuario.activo,
                }
              : item
          )
        );

        toast.success(
          usuario.activo
            ? "Usuario bloqueado"
            : "Usuario activado"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando usuario"
        );
      }
    };

  const eliminarUsuario =
    async (
      usuario: Usuario
    ) => {

      if (
        usuarioActual?.id_usuario ===
        usuario.id_usuario
      ) {

        toast.warning(
          "No puedes eliminar tu propio usuario"
        );

        return;
      }

      const confirmar =
        confirm(
          `¿Eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`
        );

      if (!confirmar) return;

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario.id_usuario}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setUsuarios((prev) =>
          prev.filter(
            (item) =>
              item.id_usuario !==
              usuario.id_usuario
          )
        );

        toast.success(
          "Usuario eliminado"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error eliminando usuario"
        );
      }
    };

  const exportarCSV =
    () => {

      const headers = [
        "ID",
        "Nombre",
        "Correo",
        "Telefono",
        "Rol",
        "Estado",
        "Registro",
      ];

      const rows =
        usuariosFiltrados.map(
          (usuario) => [
            usuario.id_usuario,
            usuario.nombre,
            usuario.correo,
            usuario.telefono || "",
            usuario.rol,
            usuario.activo
              ? "Activo"
              : "Bloqueado",
            formatDate(
              usuario.fecha_registro
            ),
          ]
        );

      const csvContent =
        [headers, ...rows]
          .map((row) =>
            row.map((value) =>
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
        "usuarios.csv";

      link.click();

      URL.revokeObjectURL(url);
    };

  const limpiarFiltros =
    () => {

      setBusqueda("");

      setFiltroRol("todos");

      setFiltroEstado("todos");
    };

  if (loading) {

    return (
      <div className="p-10">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Usuarios
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Gestiona clientes, administradores, roles y accesos.
            </p>
          </div>

          <button
            onClick={exportarCSV}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>

        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          {[
            {
              label: "Total usuarios",
              value: usuarios.length,
              icon: Users,
              className: "bg-primary/10 text-primary",
            },
            {
              label: "Administradores",
              value: totalAdmins,
              icon: ShieldCheck,
              className: "bg-purple-100 text-purple-600",
            },
            {
              label: "Activos",
              value: totalActivos,
              icon: UserCheck,
              className: "bg-green-100 text-green-600",
            },
            {
              label: "Bloqueados",
              value: totalBloqueados,
              icon: UserX,
              className: "bg-red-100 text-red-600",
            },
          ].map((item) => {

            const Icon =
              item.icon;

            return (
              <div
                key={item.label}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-500 font-semibold">
                    {item.label}
                  </p>
                  <h2 className="text-4xl font-black mt-2">
                    {item.value}
                  </h2>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.className}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            );
          })}

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8">

          <div className="grid lg:grid-cols-[1fr_180px_180px_auto] gap-4">

            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(e.target.value)
              }
              className="px-5 py-4 border border-gray-200 rounded-2xl outline-none bg-white"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Admins</option>
              <option value="cliente">Clientes</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(e.target.value)
              }
              className="px-5 py-4 border border-gray-200 rounded-2xl outline-none bg-white"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="bloqueados">Bloqueados</option>
            </select>

            <button
              onClick={limpiarFiltros}
              className="px-5 py-4 rounded-2xl border font-semibold text-gray-600 hover:bg-gray-50"
            >
              Limpiar
            </button>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[980px]">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-5">Usuario</th>
                  <th className="text-left p-5">Contacto</th>
                  <th className="text-left p-5">Rol</th>
                  <th className="text-left p-5">Estado</th>
                  <th className="text-left p-5">Registro</th>
                  <th className="text-left p-5">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario) => {

                  const isCurrentUser =
                    usuarioActual?.id_usuario ===
                    usuario.id_usuario;

                  return (
                    <tr
                      key={usuario.id_usuario}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                            {usuario.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {usuario.nombre}
                            </p>
                            {isCurrentUser && (
                              <p className="text-xs font-semibold text-primary">
                                Tu usuario
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <p className="font-semibold text-gray-700 break-all">
                          {usuario.correo}
                        </p>
                        <p className="text-sm text-gray-500">
                          {usuario.telefono || "Sin teléfono"}
                        </p>
                      </td>

                      <td className="p-5">
                        <select
                          value={usuario.rol}
                          disabled={isCurrentUser}
                          onChange={(e) =>
                            cambiarRol(
                              usuario.id_usuario,
                              e.target.value
                            )
                          }
                          className="border rounded-xl px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="cliente">Cliente</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold
                          ${
                            usuario.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {usuario.activo
                            ? "Activo"
                            : "Bloqueado"}
                        </span>
                      </td>

                      <td className="p-5 text-gray-500">
                        {formatDate(
                          usuario.fecha_registro
                        )}
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              toggleUsuario(usuario)
                            }
                            disabled={isCurrentUser}
                            className={`p-3 rounded-xl text-white transition disabled:bg-gray-300 disabled:cursor-not-allowed
                            ${
                              usuario.activo
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            title={usuario.activo ? "Bloquear" : "Activar"}
                          >
                            {usuario.activo
                              ? <Lock className="w-5 h-5" />
                              : <Unlock className="w-5 h-5" />}
                          </button>

                          <button
                            onClick={() =>
                              eliminarUsuario(usuario)
                            }
                            disabled={isCurrentUser}
                            className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>

          {usuariosFiltrados.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No hay usuarios que coincidan con los filtros.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
