import { pool } from "../config/db.js";

// OBTENER CARRITO
export const obtenerCarrito = async (
  req,
  res
) => {
  try {
    const id_usuario = req.usuario.id;

    // Buscar carrito
    const [carritoRows] =
      await pool.query(
        "SELECT * FROM carrito WHERE id_usuario = ?",
        [id_usuario]
      );

    if (carritoRows.length === 0) {
      return res.json([]);
    }

    const carrito =
      carritoRows[0];

    // Obtener productos
    const [productos] =
      await pool.query(
        `
        SELECT
          cd.id_detalle,
          cd.cantidad,

          p.id_producto,
          p.nombre,
          p.precio,
          p.imagen_url

        FROM carrito_detalle cd

        INNER JOIN productos p
        ON cd.id_producto = p.id_producto

        WHERE cd.id_carrito = ?
        `,
        [carrito.id_carrito]
      );

    res.json(productos);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje:
        "Error al obtener carrito",
    });
  }
};

// AGREGAR PRODUCTO
export const agregarProductoCarrito =
  async (req, res) => {
    try {
      const id_usuario =
        req.usuario.id;

      const {
        id_producto,
        cantidad,
      } = req.body;

      // Buscar carrito
      let [carritoRows] =
        await pool.query(
          "SELECT * FROM carrito WHERE id_usuario = ?",
          [id_usuario]
        );

      let carrito;

      // Si no existe, crear carrito
      if (
        carritoRows.length === 0
      ) {
        const [nuevoCarrito] =
          await pool.query(
            `
            INSERT INTO carrito
            (id_usuario)
            VALUES (?)
            `,
            [id_usuario]
          );

        carrito = {
          id_carrito:
            nuevoCarrito.insertId,
        };
      } else {
        carrito = carritoRows[0];
      }

      // Verificar si producto ya existe
      const [productoExistente] =
        await pool.query(
          `
          SELECT *
          FROM carrito_detalle

          WHERE id_carrito = ?
          AND id_producto = ?
          `,
          [
            carrito.id_carrito,
            id_producto,
          ]
        );

      // Si ya existe, sumar cantidad
      if (
        productoExistente.length > 0
      ) {
        await pool.query(
          `
          UPDATE carrito_detalle

          SET cantidad =
            cantidad + ?

          WHERE id_carrito = ?
          AND id_producto = ?
          `,
          [
            cantidad,
            carrito.id_carrito,
            id_producto,
          ]
        );
      } else {
        // Crear nuevo item
        await pool.query(
          `
          INSERT INTO carrito_detalle
          (
            id_carrito,
            id_producto,
            cantidad
          )

          VALUES (?, ?, ?)
          `,
          [
            carrito.id_carrito,
            id_producto,
            cantidad,
          ]
        );
      }

      res.json({
        mensaje:
          "Producto agregado al carrito",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error al agregar producto",
      });
    }
  };

// ELIMINAR PRODUCTO
export const eliminarProductoCarrito =
  async (req, res) => {
    try {
      const id_usuario =
        req.usuario.id;

      const {
        id_producto,
      } = req.params;

      // Buscar carrito
      const [carritoRows] =
        await pool.query(
          "SELECT * FROM carrito WHERE id_usuario = ?",
          [id_usuario]
        );

      if (
        carritoRows.length === 0
      ) {
        return res.status(404).json({
          mensaje:
            "Carrito no encontrado",
        });
      }

      const carrito =
        carritoRows[0];

      await pool.query(
        `
        DELETE FROM carrito_detalle

        WHERE id_carrito = ?
        AND id_producto = ?
        `,
        [
          carrito.id_carrito,
          id_producto,
        ]
      );

      res.json({
        mensaje:
          "Producto eliminado",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error al eliminar producto",
      });
    }
  };

// VACIAR CARRITO
export const vaciarCarrito =
  async (req, res) => {
    try {
      const id_usuario =
        req.usuario.id;

      // Buscar carrito
      const [carritoRows] =
        await pool.query(
          "SELECT * FROM carrito WHERE id_usuario = ?",
          [id_usuario]
        );

      if (
        carritoRows.length === 0
      ) {
        return res.json({
          mensaje:
            "Carrito vacío",
        });
      }

      const carrito =
        carritoRows[0];

      await pool.query(
        `
        DELETE FROM carrito_detalle

        WHERE id_carrito = ?
        `,
        [carrito.id_carrito]
      );

      res.json({
        mensaje:
          "Carrito vaciado",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error al vaciar carrito",
      });
    }
  };