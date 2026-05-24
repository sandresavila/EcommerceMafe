import { Router }
  from "express";

import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  esAdmin,
} from "../middlewares/role.middleware.js";

const router = Router();

// =====================================
// PUBLICAS
// =====================================

router.get(
  "/",
  obtenerCategorias
);

router.get(
  "/:id",
  obtenerCategoria
);

// =====================================
// ADMIN
// =====================================

router.post(
  "/",
  verificarToken,
  esAdmin,
  crearCategoria
);

router.put(
  "/:id",
  verificarToken,
  esAdmin,
  actualizarCategoria
);

router.delete(
  "/:id",
  verificarToken,
  esAdmin,
  eliminarCategoria
);

export default router;