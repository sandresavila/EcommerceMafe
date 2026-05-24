"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Folder,
  Plus,
  Pencil,
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

  const [nombre,
    setNombre] =
      useState("");

  const [descripcion,
    setDescripcion] =
      useState("");

  const [saving,
    setSaving] =
      useState(false);

  // =====================================
  // FETCH
  // =====================================

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

  // =====================================
  // VALIDAR
  // =====================================

  const validar =
    () => {

      if (
        !nombre.trim()
      ) {

        toast.error(
          "El nombre es obligatorio"
        );

        return false;
      }

      return true;
    };

  // =====================================
  // RESET
  // =====================================

  const reset =
    () => {

      setEditingId(null);

      setNombre("");

      setDescripcion("");

      setShowModal(false);
    };

  // =====================================
  // CREAR
  // =====================================

  const crearCategoria =
    async () => {

      try {

        if (!validar())
          return;

        setSaving(true);

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
            {
              nombre,
              descripcion,
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
            nombre,
            descripcion,
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

  // =====================================
  // EDITAR
  // =====================================

  const editarCategoria =
    async () => {

      try {

        if (!validar())
          return;

        setSaving(true);

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${editingId}`,
          {
            nombre,
            descripcion,
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
                  nombre,
                  descripcion,
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

  // =====================================
  // ELIMINAR
  // =====================================

  const eliminarCategoria =
    async (id: number) => {

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCategorias((prev) =>
          prev.filter(
            (c) =>
              c.id_categoria !== id
          )
        );

        toast.success(
          "Categoría eliminada"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error eliminando categoría"
        );
      }
    };

  // =====================================
  // EDITAR MODAL
  // =====================================

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
        categoria.descripcion
      );

      setShowModal(true);
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-10">
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-black flex items-center gap-4">

              <Folder className="w-10 h-10 text-primary" />

              Categorías

            </h1>

            <p className="text-gray-500 mt-2">
              Gestiona las categorías de productos
            </p>

          </div>

          {/* BTN */}
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-primary hover:opacity-90 transition text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-lg"
          >

            <Plus className="w-5 h-5" />

            Nueva categoría

          </button>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {categorias.map(
            (categoria) => (

            <div
              key={
                categoria.id_categoria
              }
              className="bg-white rounded-[2rem] shadow-lg p-8 hover:shadow-2xl transition"
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-bold">

                    {categoria.nombre}

                  </h2>

                  <p className="text-gray-500 mt-4 leading-relaxed">

                    {categoria.descripcion ||
                      "Sin descripción"}

                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <Folder className="w-7 h-7" />

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-8">

                <button
                  onClick={() =>
                    abrirEditar(
                      categoria
                    )
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                >

                  <Pencil className="w-5 h-5" />

                  Editar

                </button>

                <button
                  onClick={() =>
                    eliminarCategoria(
                      categoria.id_categoria
                    )
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                >

                  <Trash2 className="w-5 h-5" />

                  Eliminar

                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-xl rounded-[2rem] p-8 relative shadow-2xl">

            {/* CLOSE */}
            <button
              onClick={reset}
              className="absolute top-5 right-5 hover:scale-110 transition"
            >

              <X className="w-6 h-6" />

            </button>

            {/* TITLE */}
            <h2 className="text-4xl font-black mb-8">

              {editingId
                ? "Editar categoría"
                : "Nueva categoría"}

            </h2>

            {/* FORM */}
            <div className="space-y-5">

              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl h-36"
              />

              {/* BTN */}
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