"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  AlertTriangle,
  CheckCircle2,
  Folder,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
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

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }
  );

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

  const [busqueda,
    setBusqueda] =
      useState("");

  const [filtroCategoria,
    setFiltroCategoria] =
      useState("todas");

  const [filtroStock,
    setFiltroStock] =
      useState("todos");

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

  const [imagenPreview,
    setImagenPreview] =
      useState<string | null>(null);

  const [saving,
    setSaving] =
      useState(false);

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

  const productosFiltrados =
    useMemo(() => {

      return productos.filter(
        (producto) => {

          const texto =
            busqueda.toLowerCase();

          const matchBusqueda =
            producto.nombre
              .toLowerCase()
              .includes(texto) ||
            producto.descripcion
              .toLowerCase()
              .includes(texto);

          const matchCategoria =
            filtroCategoria === "todas"
              ? true
              : String(producto.id_categoria) ===
                filtroCategoria;

          const matchStock =
            filtroStock === "todos"
              ? true
              : filtroStock === "disponibles"
              ? producto.stock > 10
              : filtroStock === "bajo"
              ? producto.stock > 0 &&
                producto.stock <= 10
              : producto.stock <= 0;

          return (
            matchBusqueda &&
            matchCategoria &&
            matchStock
          );
        }
      );

    }, [
      productos,
      busqueda,
      filtroCategoria,
      filtroStock,
    ]);

  const productosDisponibles =
    productos.filter(
      (producto) =>
        producto.stock > 10
    ).length;

  const productosStockBajo =
    productos.filter(
      (producto) =>
        producto.stock > 0 &&
        producto.stock <= 10
    ).length;

  const productosAgotados =
    productos.filter(
      (producto) =>
        producto.stock <= 0
    ).length;

  const getCategoriaNombre =
    (id?: number) =>
      categorias.find(
        (categoria) =>
          categoria.id_categoria === id
      )?.nombre || "Sin categoría";

  const validarFormulario =
    () => {

      if (!nombre.trim()) {

        toast.error(
          "Ingresa el nombre"
        );

        return false;
      }

      if (!descripcion.trim()) {

        toast.error(
          "Ingresa la descripción"
        );

        return false;
      }

      if (Number(precio) <= 0) {

        toast.error(
          "Precio inválido"
        );

        return false;
      }

      if (Number(stock) < 0) {

        toast.error(
          "Stock inválido"
        );

        return false;
      }

      return true;
    };

  const buildFormData =
    () => {

      const formData =
        new FormData();

      formData.append(
        "nombre",
        nombre.trim()
      );

      formData.append(
        "descripcion",
        descripcion.trim()
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

      if (imagenFile) {

        formData.append(
          "imagen",
          imagenFile
        );
      }

      return formData;
    };

  const crearProducto =
    async () => {

      try {

        if (!validarFormulario()) return;

        setSaving(true);

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/productos`,
            buildFormData(),
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

        setSaving(false);
      }
    };

  const editarProducto =
    async () => {

      try {

        if (!validarFormulario()) return;

        setSaving(true);

        const response =
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/productos/${editingId}`,
            buildFormData(),
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

        setSaving(false);
      }
    };

  const eliminarProducto =
    async (
      producto: Producto
    ) => {

      const confirmar =
        confirm(
          `¿Eliminar ${producto.nombre}? Esta acción no se puede deshacer.`
        );

      if (!confirmar) return;

      try {

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/productos/${producto.id_producto}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setProductos((prev) =>
          prev.filter(
            (item) =>
              item.id_producto !==
              producto.id_producto
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

  const abrirNuevoProducto =
    () => {

      resetFormulario();

      setShowModal(true);
    };

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

      setImagenFile(null);

      setImagenPreview(
        producto.imagen_url || null
      );

      setShowModal(true);
    };

  const resetFormulario =
    () => {

      setEditingId(null);

      setNombre("");

      setDescripcion("");

      setPrecio("");

      setStock("");

      setIdCategoria("");

      setImagenFile(null);

      setImagenPreview(null);

      setShowModal(false);
    };

  const handleImagenChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setImagenFile(file);

      setImagenPreview(
        URL.createObjectURL(file)
      );
    };

  if (loading) {

    return (
      <div className="p-10">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

          <div>

            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
              <Package className="w-10 h-10 text-primary" />
              Productos
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Gestiona catálogo, precios, imágenes y stock.
            </p>

          </div>

          <button
            onClick={abrirNuevoProducto}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl hover:opacity-90 transition font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo producto
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          {[
            {
              label: "Disponibles",
              value: productosDisponibles,
              icon: CheckCircle2,
              className: "bg-green-100 text-green-700",
            },
            {
              label: "Stock bajo",
              value: productosStockBajo,
              icon: AlertTriangle,
              className: "bg-yellow-100 text-yellow-700",
            },
            {
              label: "Agotados",
              value: productosAgotados,
              icon: XCircle,
              className: "bg-red-100 text-red-700",
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
                <div className={`p-4 rounded-2xl ${item.className}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            );
          })}

        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 mb-8">

          <div className="grid lg:grid-cols-[1fr_220px_220px] gap-4">

            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={filtroCategoria}
              onChange={(e) =>
                setFiltroCategoria(e.target.value)
              }
              className="px-4 py-4 border border-gray-200 rounded-2xl outline-none bg-white"
            >
              <option value="todas">
                Todas las categorías
              </option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>

            <select
              value={filtroStock}
              onChange={(e) =>
                setFiltroStock(e.target.value)
              }
              className="px-4 py-4 border border-gray-200 rounded-2xl outline-none bg-white"
            >
              <option value="todos">
                Todo el stock
              </option>
              <option value="disponibles">
                Disponibles
              </option>
              <option value="bajo">
                Stock bajo
              </option>
              <option value="agotados">
                Agotados
              </option>
            </select>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Mostrando {productosFiltrados.length} de {productos.length} productos.
          </p>

        </div>

        {productosFiltrados.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 text-center text-gray-500 shadow-sm border border-gray-100">
            No hay productos que coincidan con los filtros.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {productosFiltrados.map((producto) => (

              <article
                key={producto.id_producto}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >

                {producto.imagen_url ? (
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    width={500}
                    height={360}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="h-60 bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}

                <div className="p-6">

                  <div className="flex justify-between items-start gap-4">

                    <div className="min-w-0">

                      <h2 className="text-2xl font-black line-clamp-1">
                        {producto.nombre}
                      </h2>

                      <p className="text-gray-500 mt-2 line-clamp-2">
                        {producto.descripcion}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        <Folder className="w-4 h-4" />
                        {getCategoriaNombre(
                          producto.id_categoria
                        )}
                      </div>

                    </div>

                    <span
                      className={`text-sm px-3 py-1 rounded-full text-white shrink-0
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
                        ? "Stock bajo"
                        : "Agotado"}
                    </span>

                  </div>

                  <div className="mt-5 text-3xl font-black text-primary">
                    {formatCurrency(
                      producto.precio
                    )}
                  </div>

                  <p className="mt-2 text-gray-500">
                    Stock: <span className="font-bold">{producto.stock}</span>
                  </p>

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
                          producto
                        )
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      Eliminar
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>

      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">

          <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-8 relative shadow-2xl max-h-[92vh] overflow-y-auto">

            <button
              onClick={resetFormulario}
              className="absolute top-5 right-5"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl sm:text-4xl font-black mb-8 pr-10">
              {editingId
                ? "Editar producto"
                : "Nuevo producto"}
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
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl h-32"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value)
                  }
                  className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
                />
              </div>

              <select
                value={idCategoria}
                onChange={(e) =>
                  setIdCategoria(e.target.value)
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl bg-white"
              >
                <option value="">
                  Selecciona categoría
                </option>
                {categorias.map((categoria) => (
                  <option
                    key={categoria.id_categoria}
                    value={categoria.id_categoria}
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="w-full border-2 border-gray-200 p-4 rounded-2xl"
              />

              {imagenPreview && (
                <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                  <Image
                    src={imagenPreview}
                    alt="Vista previa del producto"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <button
                onClick={
                  editingId
                    ? editarProducto
                    : crearProducto
                }
                disabled={saving}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition
                ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
                }`}
              >
                {saving
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
