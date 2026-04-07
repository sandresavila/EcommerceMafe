import { Router } from "express";
import { getPedidos, actualizarEstadoPedido } from "../controllers/pedidos.controller.js";

const router = Router();

router.get("/api/pedidos", getPedidos);
router.put("/api/pedidos/:id", actualizarEstadoPedido);

export default router;