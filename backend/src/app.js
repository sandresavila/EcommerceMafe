import express from "express";
import cors from "cors";

import productoRoutes from "./routes/producto.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import authRoutes from "./routes/auth.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";

const app = express();

// 1. CONFIGURACIÓN DE SEGURIDAD (CORS) - Siempre debe ir primero
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. LECTURA DE DATOS (JSON) - Necesario para que el PUT funcione
app.use(express.json());

// 3. RUTAS DE LA API
app.use(pedidosRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api", categoriaRoutes); 
app.use("/api", authRoutes); 

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("ERROR DETECTADO:");
  console.error(err.stack); 
  res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
});

export default app;