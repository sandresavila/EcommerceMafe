import express from "express";
import cors from "cors";

import productoRoutes from "./routes/producto.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import authRoutes from "./routes/auth.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";

const app = express();

// 1. CONFIGURACIÓN DE SEGURIDAD (CORS) 
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // <--- IMPORTANTE: Agregamos PATCH aquí
  credentials: true
}));

// 2. LECTURA DE DATOS (JSON)
app.use(express.json());

// 3. RUTAS DE LA API
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes); // Sugerencia: mejor usar /api/categorias para orden
app.use("/api/auth", authRoutes); // Sugerencia: mejor usar /api/auth

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("ERROR DETECTADO:");
  console.error(err.stack); 
  res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
});

export default app;