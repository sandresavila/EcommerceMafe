export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  id_categoria: number;
  categoria_nombre: string;
  es_distribuido: boolean;
}