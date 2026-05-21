import { pool } from "../config/db.js";

// =====================================
// CREAR PEDIDO
// =====================================

export const crearPedido =
  async (req, res) => {

    const connection =
      await pool.getConnection();

    try {

      await connection.beginTransaction();

      const {
        productos,
        direccion_envio,
      } = req.body;

      const id_usuario =
        req.usuario.id;

      // =====================================
      // VALIDACIONES
      // =====================================

      if (
        !productos ||
        productos.length === 0
      ) {

        throw new Error(
          "El carrito está vacío"
        );
      }

      if (!direccion_envio) {

        throw new Error(
          "La dirección es obligatoria"
        );
      }

      // =====================================
      // VALIDAR STOCK
      // =====================================

      for (const item of productos) {

        const [productoRows] =
          await connection.query(
            `
            SELECT *

            FROM productos

            WHERE id_producto = ?
            `,
            [item.id_producto]
          );

        if (
          productoRows.length === 0
        ) {

          throw new Error(
            "Producto no encontrado"
          );
        }

        const producto =
          productoRows[0];

        // SIN STOCK
        if (
          producto.stock <= 0
        ) {

          throw new Error(
            `${producto.nombre} está agotado`
          );
        }

        // STOCK INSUFICIENTE
        if (
          item.cantidad >
          producto.stock
        ) {

          throw new Error(
            `Stock insuficiente para ${producto.nombre}`
          );
        }
      }

      // =====================================
      // TOTAL
      // =====================================

      let total = 0;

      for (const item of productos) {

        total +=
          item.precio *
          item.cantidad;
      }

      // =====================================
      // CREAR PEDIDO
      // =====================================

      const [pedidoResult] =
        await connection.query(
          `
          INSERT INTO pedidos
          (
            id_usuario,
            total,
            direccion_envio
          )

          VALUES (?, ?, ?)
          `,
          [
            id_usuario,
            total,
            direccion_envio,
          ]
        );

      const id_pedido =
        pedidoResult.insertId;

      // =====================================
      // DETALLE PEDIDO
      // =====================================

      for (const item of productos) {

        await connection.query(
          `
          INSERT INTO pedido_detalle
          (
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario
          )

          VALUES (?, ?, ?, ?)
          `,
          [
            id_pedido,
            item.id_producto,
            item.cantidad,
            item.precio,
          ]
        );

        // =====================================
        // DESCONTAR STOCK
        // =====================================

        await connection.query(
          `
          UPDATE productos

          SET stock = stock - ?

          WHERE id_producto = ?
          `,
          [
            item.cantidad,
            item.id_producto,
          ]
        );
      }

      await connection.commit();

      res.status(201).json({

        message:
          "Pedido creado",

        id_pedido,
      });

    } catch (error) {

      await connection.rollback();

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });

    } finally {

      connection.release();
    }
  };

// =====================================
// OBTENER PEDIDOS
// =====================================

export const obtenerPedidos =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            p.*,
            u.nombre AS usuario_nombre

          FROM pedidos p

          INNER JOIN usuarios u
          ON p.id_usuario = u.id_usuario

          ORDER BY p.fecha DESC
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

// =====================================
// DETALLE PEDIDO
// =====================================

export const obtenerDetallePedido =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // =====================================
      // PEDIDO
      // =====================================

      const [pedidoRows] =
        await pool.query(
          `
          SELECT *

          FROM pedidos

          WHERE id_pedido = ?
          `,
          [id]
        );

      if (
        pedidoRows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Pedido no encontrado",
        });
      }

      // =====================================
      // PRODUCTOS
      // =====================================

      const [productos] =
        await pool.query(
          `
          SELECT
            pd.*,
            pr.nombre,
            pr.imagen_url

          FROM pedido_detalle pd

          INNER JOIN productos pr
          ON pd.id_producto = pr.id_producto

          WHERE pd.id_pedido = ?
          `,
          [id]
        );

      // =====================================
      // RESPUESTA
      // =====================================

      res.json({

        id_pedido:
          pedidoRows[0].id_pedido,

        total:
          pedidoRows[0].total,

        estado:
          pedidoRows[0].estado,

        productos,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =====================================
// ACTUALIZAR ESTADO
// =====================================

export const actualizarEstadoPedido =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const { estado } =
        req.body;

      await pool.query(
        `
        UPDATE pedidos

        SET estado = ?

        WHERE id_pedido = ?
        `,
        [
          estado,
          id,
        ]
      );

      res.json({
        message:
          "Estado actualizado",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =====================================
// DASHBOARD ADMIN
// =====================================

export const dashboardAdmin =
  async (req, res) => {

    try {

      // =====================================
      // TOTAL PRODUCTOS
      // =====================================

      const [productos] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM productos
          `
        );

      // =====================================
      // TOTAL PEDIDOS
      // =====================================

      const [pedidos] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM pedidos
          `
        );

      // =====================================
      // TOTAL USUARIOS
      // =====================================

      const [usuarios] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM usuarios
          `
        );

      // =====================================
      // TOTAL VENTAS
      // =====================================

      const [ventas] =
        await pool.query(
          `
          SELECT SUM(total) AS total
          FROM pedidos
          `
        );

      // =====================================
      // ULTIMOS PEDIDOS
      // =====================================

      const [ultimosPedidos] =
        await pool.query(
          `
          SELECT
            p.*,
            u.nombre AS usuario_nombre

          FROM pedidos p

          INNER JOIN usuarios u
          ON p.id_usuario = u.id_usuario

          ORDER BY p.fecha DESC

          LIMIT 5
          `
        );

      res.json({

        totalProductos:
          productos[0].total,

        totalPedidos:
          pedidos[0].total,

        totalUsuarios:
          usuarios[0].total,

        totalVentas:
          ventas[0].total || 0,

        ultimosPedidos,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };