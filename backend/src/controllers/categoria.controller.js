import { pool } from "../config/db.js";

// =====================================
// OBTENER CATEGORIAS
// =====================================

export const obtenerCategorias =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT *

          FROM categorias

          ORDER BY nombre ASC
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };