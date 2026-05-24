import { Router }
  from "express";

import {
  crearPedido,
  obtenerPedidos,
  obtenerMisPedidos,
  obtenerDetallePedido,
  actualizarEstadoPedido,
  dashboardAdmin,
} from "../controllers/pedido.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  esAdmin,
} from "../middlewares/role.middleware.js";

const router = Router();

// =====================================
// CREAR PEDIDO
// =====================================

router.post(
  "/",
  verificarToken,
  crearPedido
);

// =====================================
// MIS PEDIDOS (CLIENTE)
// =====================================

router.get(
  "/mis-pedidos",
  verificarToken,
  obtenerMisPedidos
);

// =====================================
// ADMIN PEDIDOS
// =====================================

router.get(
  "/",
  verificarToken,
  esAdmin,
  obtenerPedidos
);

// =====================================
// DETALLE PEDIDO
// =====================================

router.get(
  "/:id",
  verificarToken,
  obtenerDetallePedido
);

// =====================================
// ACTUALIZAR ESTADO
// =====================================

router.put(
  "/:id",
  verificarToken,
  esAdmin,
  actualizarEstadoPedido
);

// =====================================
// DASHBOARD ADMIN
// =====================================

router.get(
  "/dashboard/admin",
  verificarToken,
  esAdmin,
  dashboardAdmin
);

export default router;