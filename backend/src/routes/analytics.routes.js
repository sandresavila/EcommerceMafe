import { Router }
  from "express";

import {

  ventasMensuales,

  pedidosPorEstado,

  productosMasVendidos,

  usuariosNuevos,

} from "../controllers/analytics.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  esAdmin,
} from "../middlewares/role.middleware.js";

const router = Router();

// =====================================
// VENTAS MENSUALES
// =====================================

router.get(
  "/ventas-mensuales",
  verificarToken,
  esAdmin,
  ventasMensuales
);

// =====================================
// PEDIDOS POR ESTADO
// =====================================

router.get(
  "/pedidos-estados",
  verificarToken,
  esAdmin,
  pedidosPorEstado
);

// =====================================
// PRODUCTOS MÁS VENDIDOS
// =====================================

router.get(
  "/productos-top",
  verificarToken,
  esAdmin,
  productosMasVendidos
);

// =====================================
// USUARIOS NUEVOS
// =====================================

router.get(
  "/usuarios-nuevos",
  verificarToken,
  esAdmin,
  usuariosNuevos
);

export default router;