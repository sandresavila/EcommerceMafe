"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  Users,
  UserCheck,
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

export default function AdminUsuariosPage() {

  const { token } =
    useAuth();

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

  // =====================================
  // FETCH USUARIOS
  // =====================================

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

  // =====================================
  // FILTROS
  // =====================================

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
              .includes(texto);

          const matchRol =

            filtroRol === "todos"
              ? true
              : usuario.rol ===
                filtroRol;

          return (
            matchBusqueda &&
            matchRol
          );
        }
      );

    }, [
      usuarios,
      busqueda,
      filtroRol,
    ]);

  // =====================================
  // CAMBIAR ROL
  // =====================================

  const cambiarRol =
    async (
      id_usuario: number,
      rol: string
    ) => {

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

            usuario.id_usuario ===
            id_usuario

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

  // =====================================
  // BLOQUEAR / ACTIVAR
  // =====================================

  const toggleUsuario =
    async (
      id_usuario: number,
      activo: boolean
    ) => {

      try {

        const endpoint =
          activo
            ? "bloquear"
            : "activar";

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id_usuario}/${endpoint}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setUsuarios((prev) =>

          prev.map((usuario) =>

            usuario.id_usuario ===
            id_usuario

              ? {
                  ...usuario,
                  activo:
                    !activo,
                }

              : usuario
          )
        );

        toast.success(

          activo
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

  // =====================================
  // ELIMINAR
  // =====================================

  const eliminarUsuario =
    async (
      id_usuario: number
    ) => {

      const confirmar =
        confirm(
          "¿Eliminar usuario?"
        );

      if (!confirmar) return;

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id_usuario}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setUsuarios((prev) =>

          prev.filter(
            (usuario) =>

              usuario.id_usuario !==
              id_usuario
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

  // =====================================
  // STATS
  // =====================================

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

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="p-10">

        Cargando usuarios...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-black text-gray-900">

            Usuarios

          </h1>

          <p className="text-gray-500 mt-3 text-lg">

            Gestión avanzada de usuarios

          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* TOTAL */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Total usuarios
                </p>

                <h2 className="text-5xl font-black mt-3">

                  {usuarios.length}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                <Users className="w-8 h-8" />

              </div>

            </div>

          </div>

          {/* ADMINS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Administradores
                </p>

                <h2 className="text-5xl font-black mt-3 text-purple-600">

                  {totalAdmins}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">

                <ShieldCheck className="w-8 h-8" />

              </div>

            </div>

          </div>

          {/* ACTIVOS */}
          <div className="bg-white rounded-[2rem] p-7 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Activos
                </p>

                <h2 className="text-5xl font-black mt-3 text-green-600">

                  {totalActivos}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                <UserCheck className="w-8 h-8" />

              </div>

            </div>

          </div>

        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-[2rem] shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row gap-4">

            {/* SEARCH */}
            <div className="flex-1 relative">

              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full pl-12 pr-4 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

            {/* FILTRO */}
            <select
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(
                  e.target.value
                )
              }
              className="px-5 py-4 border rounded-2xl outline-none"
            >

              <option value="todos">
                Todos
              </option>

              <option value="admin">
                Admins
              </option>

              <option value="cliente">
                Clientes
              </option>

            </select>

          </div>

        </div>

        {/* TABLA */}
        <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-5">
                    Usuario
                  </th>

                  <th className="text-left p-5">
                    Rol
                  </th>

                  <th className="text-left p-5">
                    Estado
                  </th>

                  <th className="text-left p-5">
                    Registro
                  </th>

                  <th className="text-left p-5">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {usuariosFiltrados.map(
                  (usuario) => (

                  <tr
                    key={
                      usuario.id_usuario
                    }
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* USER */}
                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">

                          {usuario.nombre.charAt(0)}

                        </div>

                        <div>

                          <p className="font-semibold">

                            {usuario.nombre}

                          </p>

                          <p className="text-sm text-gray-500">

                            {usuario.correo}

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ROL */}
                    <td className="p-5">

                      <select
                        value={usuario.rol}
                        onChange={(e) =>
                          cambiarRol(
                            usuario.id_usuario,
                            e.target.value
                          )
                        }
                        className="border rounded-xl px-3 py-2"
                      >

                        <option value="cliente">
                          Cliente
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>

                    {/* ESTADO */}
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

                    {/* FECHA */}
                    <td className="p-5 text-gray-500">

                      {usuario.fecha_registro

                        ? new Date(
                            usuario.fecha_registro
                          ).toLocaleDateString(
                            "es-CO"
                          )

                        : "-"}

                    </td>

                    {/* ACCIONES */}
                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        {/* BLOQUEAR */}
                        <button
                          onClick={() =>
                            toggleUsuario(
                              usuario.id_usuario,
                              !!usuario.activo
                            )
                          }
                          className={`p-3 rounded-xl text-white transition
                          ${
                            usuario.activo
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >

                          {usuario.activo
                            ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              <Unlock className="w-5 h-5" />
                            )}

                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            eliminarUsuario(
                              usuario.id_usuario
                            )
                          }
                          className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                        >

                          <Trash2 className="w-5 h-5" />

                        </button>

                      </div>

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