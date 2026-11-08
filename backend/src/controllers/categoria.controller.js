import {logError} from '../utils/errors.js';
import { pool } from "../config/db.js";

// =====================================
// OBTENER CATEGORIAS
// =====================================

export const obtenerCategorias =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(`
          SELECT
            c.id_categoria,
            c.nombre,
            c.descripcion,
            COUNT(p.id_producto) AS total_productos

          FROM categorias c

          LEFT JOIN productos p
          ON p.id_categoria = c.id_categoria

          GROUP BY
            c.id_categoria,
            c.nombre,
            c.descripcion

          ORDER BY c.nombre ASC
        `);

      res.json(rows);

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error obteniendo categorías",
      });
    }
  };

// =====================================
// OBTENER UNA CATEGORIA
// =====================================

export const obtenerCategoria =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const [rows] =
        await pool.query(
          `
          SELECT *
          FROM categorias
          WHERE id_categoria = ?
          `,
          [id]
        );

      if (
        rows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Categoría no encontrada",
        });
      }

      res.json(rows[0]);

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error obteniendo categoría",
      });
    }
  };

// =====================================
// CREAR CATEGORIA
// =====================================

export const crearCategoria =
  async (req, res) => {

    try {

      const {
        nombre,
        descripcion,
      } = req.body;

      if (!nombre) {

        return res.status(400).json({
          message:
            "El nombre es obligatorio",
        });
      }

      const [existe] =
        await pool.query(
          `
          SELECT *
          FROM categorias
          WHERE nombre = ?
          `,
          [nombre]
        );

      if (
        existe.length > 0
      ) {

        return res.status(400).json({
          message:
            "La categoría ya existe",
        });
      }

      const [result] =
        await pool.query(
          `
          INSERT INTO categorias
          (
            nombre,
            descripcion
          )

          VALUES (?, ?)
          `,
          [
            nombre,
            descripcion,
          ]
        );

      res.status(201).json({

        message:
          "Categoría creada",

        id_categoria:
          result.insertId,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error creando categoría",
      });
    }
  };

// =====================================
// ACTUALIZAR CATEGORIA
// =====================================

export const actualizarCategoria =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        nombre,
        descripcion,
      } = req.body;

      await pool.query(
        `
        UPDATE categorias

        SET
          nombre = ?,
          descripcion = ?

        WHERE id_categoria = ?
        `,
        [
          nombre,
          descripcion,
          id,
        ]
      );

      res.json({
        message:
          "Categoría actualizada",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error actualizando categoría",
      });
    }
  };

// =====================================
// ELIMINAR CATEGORIA
// =====================================

export const eliminarCategoria =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        DELETE FROM categorias
        WHERE id_categoria = ?
        `,
        [id]
      );

      res.json({
        message:
          "Categoría eliminada",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error eliminando categoría",
      });
    }
  };
