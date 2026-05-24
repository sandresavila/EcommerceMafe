import express from "express";

import dotenv from "dotenv";

import path from "path";

// APP
import app from "./app.js";

// ROUTES
import usuarioRoutes
  from "./routes/usuario.routes.js";

import productoRoutes
  from "./routes/producto.routes.js";

import authRoutes
  from "./routes/auth.routes.js";

import carritoRoutes
  from "./routes/carrito.routes.js";

import pedidoRoutes
  from "./routes/pedido.routes.js";

import categoriaRoutes
  from "./routes/categoria.routes.js";

import favoritoRoutes
  from "./routes/favoritos.routes.js";

import analyticsRoutes
  from "./routes/analytics.routes.js"; 


dotenv.config();

const PORT =
  process.env.PORT || 4000;

// =====================================
// IMAGENES
// =====================================

app.use(
  "/uploads",
  express.static(
    path.resolve("uploads")
  )
);

// =====================================
// ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/usuarios",
  usuarioRoutes
);

app.use(
  "/api/productos",
  productoRoutes
);

app.use(
  "/api/carrito",
  carritoRoutes
);

app.use(
  "/api/pedidos",
  pedidoRoutes
);

app.use(
  "/api/categorias",
  categoriaRoutes
);

app.use(
  "/api/favoritos",
  favoritoRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

// =====================================
// SERVER
// =====================================

app.listen(PORT, () => {

  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  );
});