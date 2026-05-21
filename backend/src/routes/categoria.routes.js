import { Router }
  from "express";

import {
  obtenerCategorias,
} from "../controllers/categoria.controller.js";

const router = Router();

// =====================================
// OBTENER CATEGORIAS
// =====================================

router.get(
  "/",
  obtenerCategorias
);

export default router;