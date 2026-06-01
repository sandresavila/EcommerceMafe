"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Boxes,
  Folder,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

interface Categoria {

  id_categoria: number;

  nombre: string;

  descripcion: string;

  total_productos?: number;
}

export default function AdminCategoriasPage() {

  const { token } =
    useAuth();

  const [categorias,
    setCategorias] =
      useState<Categoria[]>([]);

  const [loading,
    setLoading] =
      useState(true);

  const [showModal,
    setShowModal] =
      useState(false);

  const [editingId,
    setEditingId] =
      useState<number | null>(null);

  const [busqueda,
    setBusqueda] =
      useState("");

  const [nombre,
    setNombre] =
      useState("");

  const [descripcion,
    setDescripcion] =
      useState("");

  const [saving,
    setSaving] =
      useState(false);

  useEffect(() => {

    const fetchCategorias =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/categorias`
            );

          setCategorias(
            response.data
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando categorías"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchCategorias();

  }, []);

  const categoriasFiltradas =
    useMemo(() => {

      const texto =
        busqueda.toLowerCase();

      return categorias.filter(
        (categoria) =>
          categoria.nombre
            .toLowerCase()
            .includes(texto) ||
          (categoria.descripcion || "")
            .toLowerCase()
            .includes(texto)
      );

    }, [
      categorias,
      busqueda,
    ]);

  const categoriasConProductos =
    categorias.filter(
      (categoria) =>
        Number(categoria.total_productos || 0) > 0
    ).length;

  const totalProductosAsignados =
    categorias.reduce(
      (acc, categoria) =>
        acc + Number(categoria.total_productos || 0),
      0
    );

  const validar =
    () => {

      if (!nombre.trim()) {

        toast.error(
          "El nombre es obligatorio"
        );

        return false;
      }

      return true;
    };

  const reset =
    () => {

      setEditingId(null);

      setNombre("");

      setDescripcion("");

      setShowModal(false);
    };

  const crearCategoria =
    async () => {

      try {

        if (!validar()) return;

        setSaving(true);

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
            {
              nombre: nombre.trim(),
              descripcion: descripcion.trim(),
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCategorias((prev) => [
          {
            id_categoria:
              response.data.id_categoria,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            total_productos: 0,
          },
          ...prev,
        ]);

        toast.success(
          "Categoría creada"
        );

        reset();

      } catch (error) {

        console.error(error);

        toast.error(
          "Error creando categoría"
        );

      } finally {

        setSaving(false);
      }
    };

  const editarCategoria =
    async () => {

      try {

        if (!validar()) return;

        setSaving(true);

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${editingId}`,
          {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCategorias((prev) =>
          prev.map((categoria) =>
            categoria.id_categoria ===
            editingId
              ? {
                  ...categoria,
                  nombre: nombre.trim(),
                  descripcion: descripcion.trim(),
                }
              : categoria
          )
        );

        toast.success(
          "Categoría actualizada"
        );

        reset();

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando categoría"
        );

      } finally {

        setSaving(false);
      }
    };

  const eliminarCategoria =
    async (
      categoria: Categoria
    ) => {

      const totalProductos =
        Number(categoria.total_productos || 0);

      const confirmar =
        confirm(
          totalProductos > 0
            ? `La categoría "${categoria.nombre}" tiene ${totalProductos} productos. Si la base de datos no permite eliminarla, deberás mover esos productos primero. ¿Quieres intentarlo?`
            : `¿Eliminar la categoría "${categoria.nombre}"?`
        );

      if (!confirmar) return;

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${categoria.id_categoria}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCategorias((prev) =>
          prev.filter(
            (item) =>
              item.id_categoria !==
              categoria.id_categoria
          )
        );

        toast.success(
          "Categoría eliminada"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "No se pudo eliminar la categoría"
        );
      }
    };

  const abrirNueva =
    () => {

      reset();

      setShowModal(true);
    };

  const abrirEditar =
    (
      categoria: Categoria
    ) => {

      setEditingId(
        categoria.id_categoria
      );

      setNombre(
        categoria.nombre
      );

      setDescripcion(
        categoria.descripcion || ""
      );

      setShowModal(true);
    };

  if (loading) {

    return (
      <div className="p-10">
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

          <div>

            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4">
              <Folder className="w-10 h-10 text-primary" />
              Categorías
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Organiza el catálogo y revisa cuántos productos usa cada categoría.
            </p>

          </div>

          <button
            onClick={abrirNueva}
            className="bg-primary hover:opacity-90 transition text-white px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva categoría
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 font-semibold">Categorías</p>
            <h2 className="text-4xl font-black mt-2">{categorias.length}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 font-semibold">Con productos</p>
            <h2 className="text-4xl font-black mt-2 text-primary">{categoriasConProductos}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 font-semibold">Productos asignados</p>
            <h2 className="text-4xl font-black mt-2 text-green-600">{totalProductosAsignados}</h2>
          </div>

        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Mostrando {categoriasFiltradas.length} de {categorias.length} categorías.
          </p>
        </div>

        {categoriasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500 shadow-sm border border-gray-100">
            No hay categorías que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categoriasFiltradas.map((categoria) => (
              <article
                key={categoria.id_categoria}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black line-clamp-1">
                      {categoria.nombre}
                    </h2>
                    <p className="text-gray-500 mt-4 leading-relaxed line-clamp-2">
                      {categoria.descripcion || "Sin descripción"}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Folder className="w-7 h-7" />
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  <Boxes className="w-4 h-4" />
                  {Number(categoria.total_productos || 0)} productos
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() =>
                      abrirEditar(categoria)
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-5 h-5" />
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarCategoria(categoria)
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">
          <div className="bg-white w-full max-w-xl rounded-3xl p-5 sm:p-8 relative shadow-2xl">
            <button
              onClick={reset}
              className="absolute top-5 right-5 hover:scale-110 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl sm:text-4xl font-black mb-8 pr-10">
              {editingId
                ? "Editar categoría"
                : "Nueva categoría"}
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl h-36"
              />

              <button
                onClick={
                  editingId
                    ? editarCategoria
                    : crearCategoria
                }
                disabled={saving}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition
                ${
                  saving
                    ? "bg-gray-400"
                    : "bg-primary hover:opacity-90"
                }`}
              >
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear categoría"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
