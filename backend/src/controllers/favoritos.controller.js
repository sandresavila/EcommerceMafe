import { pool } from "../config/db.js";

// =====================================
// OBTENER FAVORITOS
// =====================================

export const obtenerFavoritos =
  async (req, res) => {

    try {

      const id_usuario =
        req.usuario.id;

      const [rows] =
        await pool.query(
          `
          SELECT
            f.id_favorito,
            p.*

          FROM favoritos f

          INNER JOIN productos p
          ON f.id_producto = p.id_producto

          WHERE f.id_usuario = ?

          ORDER BY f.created_at DESC
          `,
          [id_usuario]
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =====================================
// AGREGAR FAVORITO
// =====================================

export const agregarFavorito =
  async (req, res) => {

    try {

      const id_usuario =
        req.usuario.id;

      const {
        id_producto,
      } = req.body;

      // VALIDAR EXISTENCIA
      const [existe] =
        await pool.query(
          `
          SELECT *

          FROM favoritos

          WHERE id_usuario = ?
          AND id_producto = ?
          `,
          [
            id_usuario,
            id_producto,
          ]
        );

      if (
        existe.length > 0
      ) {

        return res.status(400).json({
          message:
            "El producto ya está en favoritos",
        });
      }

      // INSERT
      await pool.query(
        `
        INSERT INTO favoritos
        (
          id_usuario,
          id_producto
        )

        VALUES (?, ?)
        `,
        [
          id_usuario,
          id_producto,
        ]
      );

      res.status(201).json({
        message:
          "Producto agregado a favoritos",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =====================================
// ELIMINAR FAVORITO
// =====================================

export const eliminarFavorito =
  async (req, res) => {

    try {

      const id_usuario =
        req.usuario.id;

      const {
        id_producto,
      } = req.params;

      await pool.query(
        `
        DELETE FROM favoritos

        WHERE id_usuario = ?
        AND id_producto = ?
        `,
        [
          id_usuario,
          id_producto,
        ]
      );

      res.json({
        message:
          "Favorito eliminado",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };