import { pool } from "../config/db.js";

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categorias");
    res.json(rows); 
  } catch (error) {
    console.error("Error en DB:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};