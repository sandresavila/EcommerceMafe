"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  X,
  Package,
  Pencil,
  Trash2,
  Folder,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  Producto,
} from "@/types/producto";

interface Categoria {

  id_categoria: number;

  nombre: string;
}

export default function AdminProductosPage() {

  const { token } =
    useAuth();

  const [productos,
    setProductos] =
      useState<Producto[]>([]);

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

  // =====================================
  // FORM
  // =====================================

  const [nombre,
    setNombre] =
      useState("");

  const [descripcion,
    setDescripcion] =
      useState("");

  const [precio,
    setPrecio] =
      useState("");

  const [stock,
    setStock] =
      useState("");

  const [idCategoria,
    setIdCategoria] =
      useState("");

  const [imagenFile,
    setImagenFile] =
      useState<File | null>(null);

  const [creating,
    setCreating] =
      useState(false);

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const [
            productosRes,
            categoriasRes,
          ] = await Promise.all([

            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/productos`
            ),

            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/categorias`
            ),
          ]);

          setProductos(
            productosRes.data
          );

          setCategorias(
            categoriasRes.data
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando datos"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  // =====================================
  // VALIDACIONES
  // =====================================

  const validarFormulario =
    () => {

      if (
        !nombre.trim()
      ) {

        toast.error(
          "Ingresa el nombre"
        );

        return false;
      }

      if (
        !descripcion.trim()
      ) {

        toast.error(
          "Ingresa la descripción"
        );

        return false;
      }

      if (
        Number(precio) <= 0
      ) {

        toast.error(
          "Precio inválido"
        );

        return false;
      }

      if (
        Number(stock) < 0
      ) {

        toast.error(
          "Stock inválido"
        );

        return false;
      }

      return true;
    };

  // =====================================
  // CREAR
  // =====================================

  const crearProducto =
    async () => {

      try {

        if (
          !validarFormulario()
        ) return;

        setCreating(true);

        const formData =
          new FormData();

        formData.append(
          "nombre",
          nombre
        );

        formData.append(
          "descripcion",
          descripcion
        );

        formData.append(
          "precio",
          precio
        );

        formData.append(
          "stock",
          stock
        );

        formData.append(
          "id_categoria",
          idCategoria
        );

        if (
          imagenFile
        ) {

          formData.append(
            "imagen",
            imagenFile
          );
        }

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/productos`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setProductos((prev) => [
          response.data,
          ...prev,
        ]);

        toast.success(
          "Producto creado"
        );

        resetFormulario();

      } catch (error) {

        console.error(error);

        toast.error(
          "Error creando producto"
        );

      } finally {

        setCreating(false);
      }
    };

  // =====================================
  // EDITAR
  // =====================================

  const editarProducto =
    async () => {

      try {

        if (
          !validarFormulario()
        ) return;

        setCreating(true);

        const formData =
          new FormData();

        formData.append(
          "nombre",
          nombre
        );

        formData.append(
          "descripcion",
          descripcion
        );

        formData.append(
          "precio",
          precio
        );

        formData.append(
          "stock",
          stock
        );

        formData.append(
          "id_categoria",
          idCategoria
        );

        if (
          imagenFile
        ) {

          formData.append(
            "imagen",
            imagenFile
          );
        }

        const response =
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/productos/${editingId}`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setProductos((prev) =>
          prev.map((producto) =>
            producto.id_producto ===
            editingId
              ? response.data
              : producto
          )
        );

        toast.success(
          "Producto actualizado"
        );

        resetFormulario();

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando producto"
        );

      } finally {

        setCreating(false);
      }
    };

  // =====================================
  // ELIMINAR
  // =====================================

  const eliminarProducto =
    async (
      id: number
    ) => {

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setProductos((prev) =>
          prev.filter(
            (p) =>
              p.id_producto !== id
          )
        );

        toast.success(
          "Producto eliminado"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error eliminando producto"
        );
      }
    };

  // =====================================
  // ABRIR EDITAR
  // =====================================

  const abrirEditarProducto =
    (
      producto: Producto
    ) => {

      setEditingId(
        producto.id_producto
      );

      setNombre(
        producto.nombre
      );

      setDescripcion(
        producto.descripcion
      );

      setPrecio(
        producto.precio.toString()
      );

      setStock(
        producto.stock.toString()
      );

      setIdCategoria(
        producto.id_categoria?.toString() || ""
      );

      setShowModal(true);
    };

  // =====================================
  // RESET
  // =====================================

  const resetFormulario =
    () => {

      setEditingId(null);

      setNombre("");

      setDescripcion("");

      setPrecio("");

      setStock("");

      setIdCategoria("");

      setImagenFile(null);

      setShowModal(false);
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-10">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold flex items-center gap-3">

              <Package className="w-10 h-10 text-primary" />

              Productos

            </h1>

            <p className="text-gray-500 mt-2">
              Gestiona tu catálogo
            </p>

          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-primary text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
          >
            Nuevo producto
          </button>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {productos.map(
            (producto) => (

            <div
              key={
                producto.id_producto
              }
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >

              {/* IMAGEN */}
              {producto.imagen_url && (

                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  width={400}
                  height={300}
                  className="w-full h-60 object-cover"
                />
              )}

              {/* CONTENT */}
              <div className="p-6">

                <div className="flex justify-between items-start gap-4">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {producto.nombre}
                    </h2>

                    <p className="text-gray-500 mt-2 line-clamp-2">
                      {producto.descripcion}
                    </p>

                    {/* CATEGORIA */}
                    {producto.id_categoria && (

                      <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">

                        <Folder className="w-4 h-4" />

                        {producto.id_categoria}

                      </div>
                    )}

                  </div>

                  {/* STOCK */}
                  <span
                    className={`text-sm px-3 py-1 rounded-full text-white
                    ${
                      producto.stock > 10
                        ? "bg-green-500"
                        : producto.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >

                    {producto.stock > 10
                      ? "Disponible"
                      : producto.stock > 0
                      ? "Pocas unidades"
                      : "Agotado"}

                  </span>

                </div>

                {/* PRECIO */}
                <div className="mt-5 text-3xl font-bold text-primary">

                  $
                  {Number(
                    producto.precio
                  ).toLocaleString(
                    "es-CO"
                  )}

                </div>

                {/* STOCK */}
                <p className="mt-2 text-gray-500">
                  Stock:
                  {" "}
                  {producto.stock}
                </p>

                {/* ACCIONES */}
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      abrirEditarProducto(
                        producto
                      )
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                  >

                    <Pencil className="w-5 h-5" />

                    Editar

                  </button>

                  <button
                    onClick={() =>
                      eliminarProducto(
                        producto.id_producto
                      )
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                  >

                    <Trash2 className="w-5 h-5" />

                    Eliminar

                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl">

            {/* CLOSE */}
            <button
              onClick={
                resetFormulario
              }
              className="absolute top-5 right-5"
            >

              <X className="w-6 h-6" />

            </button>

            {/* TITLE */}
            <h2 className="text-4xl font-bold mb-8">

              {editingId
                ? "Editar Producto"
                : "Nuevo Producto"}

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
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl h-32"
              />

              <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) =>
                  setPrecio(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

              {/* CATEGORIAS */}
              <select
                value={idCategoria}
                onChange={(e) =>
                  setIdCategoria(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              >

                <option value="">
                  Selecciona categoría
                </option>

                {categorias.map(
                  (categoria) => (

                    <option
                      key={categoria.id_categoria}
                      value={categoria.id_categoria}
                    >

                      {categoria.nombre}

                    </option>
                  )
                )}

              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {

                  if (
                    e.target.files
                  ) {

                    setImagenFile(
                      e.target.files[0]
                    );
                  }
                }}
                className="w-full border-2 border-gray-200 p-4 rounded-2xl"
              />

              {/* BTN */}
              <button
                onClick={
                  editingId
                    ? editarProducto
                    : crearProducto
                }
                disabled={
                  creating
                }
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition
                ${
                  creating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
                }`}
              >

                {creating
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear producto"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}