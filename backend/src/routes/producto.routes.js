import { Router } from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from "../controllers/producto.controller.js";

const router = Router();

// Ruta para crear un producto (Solo la usará el Admin)
router.post('/admin/nuevo', createProducto);

// Ruta para eliminar un producto
router.delete('/admin/eliminar/:id', deleteProducto);

// Obtener todos los productos
router.get("/", getProductos);

// Obtener uno por ID
router.get("/:id", getProductoById);

// Crear producto
router.post("/", createProducto);

// Actualizar producto
router.put("/:id", updateProducto);

// Eliminar producto
router.delete("/:id", deleteProducto);

export default router;