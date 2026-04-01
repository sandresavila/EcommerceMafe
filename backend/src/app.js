import express from "express";
import cors from "cors";

import productoRoutes from "./routes/producto.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/productos", productoRoutes);

export default app;