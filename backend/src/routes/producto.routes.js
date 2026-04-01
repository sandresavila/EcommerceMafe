import { Router } from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from "../controllers/producto.controller.js";

const router = Router();

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