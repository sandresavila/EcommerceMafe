import {validateProduct} from '../middlewares/product.middleware.js';
import { Router } from "express";

import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/producto.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

import { esAdmin } from "../middlewares/role.middleware.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// =============================
// RUTAS PÚBLICAS
// =============================

// Obtener todos los productos
router.get("/", getProductos);

// Obtener producto por ID
router.get("/:id", getProductoById);

// =============================
// RUTAS ADMIN
// =============================

// Crear producto
router.post(
  "/",
  verificarToken,
  esAdmin,
  upload.single("imagen"),
  validateProduct,
  createProducto
);

// Actualizar producto
router.put(
  "/:id",
  verificarToken,
  esAdmin,
  upload.single("imagen"),
  validateProduct,
  updateProducto
);

// Eliminar producto
router.delete(
  "/:id",
  verificarToken,
  esAdmin,
  deleteProducto
);

export default router;