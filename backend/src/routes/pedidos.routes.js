import { Router } from "express";
import { 
    getPedidos, 
    actualizarEstadoPedido, 
    getDashboardStats  
} from "../controllers/pedidos.controller.js";

const router = Router();

router.get("/stats", getDashboardStats);
router.get("/", getPedidos);
router.patch("/:id", actualizarEstadoPedido);
router.patch("/", actualizarEstadoPedido);

export default router;