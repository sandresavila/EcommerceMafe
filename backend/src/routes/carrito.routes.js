import { Router } from "express";

import {
  obtenerCarrito,
  agregarProductoCarrito,
  eliminarProductoCarrito,
  vaciarCarrito,
} from "../controllers/carrito.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener carrito usuario
router.get(
  "/",
  verificarToken,
  obtenerCarrito
);

// Agregar producto
router.post(
  "/",
  verificarToken,
  agregarProductoCarrito
);

// Eliminar producto
router.delete(
  "/:id_producto",
  verificarToken,
  eliminarProductoCarrito
);

// Vaciar carrito
router.delete(
  "/",
  verificarToken,
  vaciarCarrito
);

export default router;