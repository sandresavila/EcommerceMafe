import { pool } from "../config/db.js";

// =========================================
// OBTENER TODOS
// =========================================
export const getProductos =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            p.*,
            c.nombre AS categoria_nombre

          FROM productos p

          LEFT JOIN categorias c
          ON p.id_categoria = c.id_categoria

          ORDER BY p.fecha_creacion DESC
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =========================================
// OBTENER POR ID
// =========================================
export const getProductoById =
  async (req, res) => {

    try {

      const { id } = req.params;

      const [rows] =
        await pool.query(
          `
          SELECT
            p.*,
            c.nombre AS categoria_nombre

          FROM productos p

          LEFT JOIN categorias c
          ON p.id_categoria = c.id_categoria

          WHERE p.id_producto = ?
          `,
          [id]
        );

      if (rows.length === 0) {

        return res.status(404).json({
          message:
            "Producto no encontrado",
        });
      }

      res.json(rows[0]);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =========================================
// CREAR PRODUCTO
// =========================================
export const createProducto =
  async (req, res) => {

    try {

      const {
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        es_distribuido,
      } = req.body;

      // =====================================
      // IMAGEN
      // =====================================

      const imagen_url =
        req.file
          ? `http://localhost:4000/uploads/${req.file.filename}`
          : null;

      // =====================================
      // INSERT
      // =====================================

      const [result] =
        await pool.query(
          `
          INSERT INTO productos
          (
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria,
            imagen_url,
            es_distribuido
          )

          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria || null,
            imagen_url,
            es_distribuido || false,
          ]
        );

      // =====================================
      // DEVOLVER PRODUCTO
      // =====================================

      res.status(201).json({

        id_producto:
          result.insertId,

        nombre,
        descripcion,
        precio,
        stock,

        id_categoria:
          id_categoria || null,

        imagen_url,

        es_distribuido:
          es_distribuido || false,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =========================================
// ACTUALIZAR PRODUCTO
// =========================================
export const updateProducto =
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        es_distribuido,
      } = req.body;

      // =====================================
      // OBTENER PRODUCTO ACTUAL
      // =====================================

      const [productoActual] =
        await pool.query(
          `
          SELECT *
          FROM productos

          WHERE id_producto = ?
          `,
          [id]
        );

      if (
        productoActual.length === 0
      ) {

        return res.status(404).json({
          message:
            "Producto no encontrado",
        });
      }

      // =====================================
      // IMAGEN
      // =====================================

      let imagen_url =
        productoActual[0].imagen_url;

      // SI SUBE NUEVA IMAGEN
      if (req.file) {

        imagen_url =
          `http://localhost:4000/uploads/${req.file.filename}`;
      }

      // =====================================
      // UPDATE
      // =====================================

      await pool.query(
        `
        UPDATE productos

        SET
          nombre = ?,
          descripcion = ?,
          precio = ?,
          stock = ?,
          id_categoria = ?,
          imagen_url = ?,
          es_distribuido = ?

        WHERE id_producto = ?
        `,
        [
          nombre,
          descripcion,
          precio,
          stock,
          id_categoria || null,
          imagen_url,
          es_distribuido || false,
          id,
        ]
      );

      // =====================================
      // RESPUESTA
      // =====================================

      res.json({

        id_producto: id,

        nombre,
        descripcion,
        precio,
        stock,

        id_categoria:
          id_categoria || null,

        imagen_url,

        es_distribuido:
          es_distribuido || false,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// =========================================
// ELIMINAR PRODUCTO
// =========================================
export const deleteProducto =
  async (req, res) => {

    try {

      const { id } = req.params;

      const [result] =
        await pool.query(
          `
          DELETE FROM productos

          WHERE id_producto = ?
          `,
          [id]
        );

      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({
          message:
            "Producto no encontrado",
        });
      }

      res.json({
        message:
          "Producto eliminado",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };