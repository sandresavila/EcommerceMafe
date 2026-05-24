import { Router }
  from "express";

import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../controllers/favoritos.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================
// OBTENER FAVORITOS
// =====================================

router.get(
  "/",
  verificarToken,
  obtenerFavoritos
);

// =====================================
// AGREGAR FAVORITO
// =====================================

router.post(
  "/",
  verificarToken,
  agregarFavorito
);

// =====================================
// ELIMINAR FAVORITO
// =====================================

router.delete(
  "/:id_producto",
  verificarToken,
  eliminarFavorito
);

export default router;