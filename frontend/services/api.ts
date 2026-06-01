import { Producto } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Obtener TODOS los productos
export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}/productos`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return res.json();
};

// 🔹 Obtener producto por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Producto no encontrado");
  }

  return res.json();
};
