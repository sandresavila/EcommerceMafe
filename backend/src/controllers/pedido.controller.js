import { pool } from "../config/db.js";

import {
  transporter,
} from "../utils/mailer.js";

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
      // USUARIO
      // =====================================

      const [usuarioRows] =
        await connection.query(
          `
          SELECT *

          FROM usuarios

          WHERE id_usuario = ?
          `,
          [id_usuario]
        );

      const usuario =
        usuarioRows[0];

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

      // =====================================
      // HTML PRODUCTOS
      // =====================================

      const productosHTML =
        productos.map(
          (item) => {

            const subtotal =
              item.precio *
              item.cantidad;

            return `
              <tr>

                <td style="
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                ">
                  ${item.nombre}
                </td>

                <td style="
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  text-align: center;
                ">
                  ${item.cantidad}
                </td>

                <td style="
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  text-align: right;
                ">
                  $${Number(item.precio)
                    .toLocaleString("es-CO")}
                </td>

                <td style="
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  text-align: right;
                ">
                  $${subtotal
                    .toLocaleString("es-CO")}
                </td>

              </tr>
            `;
          }
        ).join("");

      // =====================================
      // COMMIT
      // =====================================

      await connection.commit();

      // =====================================
      // EMAIL PEDIDO
      // =====================================

      try {

        await transporter.sendMail({

          from:
            `"MAFE Beauty" <${process.env.EMAIL_USER}>`,

          to:
            usuario.correo,

          subject:
            `📦 Pedido #${id_pedido} confirmado`,

          html: `
            <div style="
              font-family: Arial;
              background: #f9fafb;
              padding: 40px;
            ">

              <div style="
                max-width: 700px;
                margin: auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
              ">

                <!-- HEADER -->
                <div style="
                  background: linear-gradient(
                    135deg,
                    #ec4899,
                    #f472b6
                  );
                  color: white;
                  padding: 40px;
                  text-align: center;
                ">

                  <h1 style="
                    margin: 0;
                    font-size: 38px;
                  ">
                    Pedido confirmado 📦
                  </h1>

                  <p style="
                    margin-top: 10px;
                    font-size: 18px;
                  ">
                    Gracias por comprar en
                    MAFE Beauty
                  </p>

                </div>

                <!-- BODY -->
                <div style="
                  padding: 40px;
                ">

                  <h2 style="
                    color: #ec4899;
                  ">
                    Hola ${usuario.nombre} 💖
                  </h2>

                  <p>
                    Tu pedido fue creado exitosamente.
                  </p>

                  <!-- INFO -->
                  <div style="
                    background: #f3f4f6;
                    padding: 20px;
                    border-radius: 14px;
                    margin: 30px 0;
                  ">

                    <p>
                      <strong>Pedido:</strong>
                      #${id_pedido}
                    </p>

                    <p>
                      <strong>Estado:</strong>
                      pendiente
                    </p>

                    <p>
                      <strong>Dirección:</strong>
                      ${direccion_envio}
                    </p>

                  </div>

                  <!-- TABLA -->
                  <table style="
                    width: 100%;
                    border-collapse: collapse;
                  ">

                    <thead>

                      <tr style="
                        background: #ec4899;
                        color: white;
                      ">

                        <th style="
                          padding: 14px;
                          text-align: left;
                        ">
                          Producto
                        </th>

                        <th style="
                          padding: 14px;
                        ">
                          Cantidad
                        </th>

                        <th style="
                          padding: 14px;
                          text-align: right;
                        ">
                          Precio
                        </th>

                        <th style="
                          padding: 14px;
                          text-align: right;
                        ">
                          Subtotal
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      ${productosHTML}

                    </tbody>

                  </table>

                  <!-- TOTAL -->
                  <div style="
                    margin-top: 30px;
                    text-align: right;
                  ">

                    <h2 style="
                      color: #ec4899;
                    ">

                      Total:
                      $${Number(total)
                        .toLocaleString("es-CO")}

                    </h2>

                  </div>

                </div>

                <!-- FOOTER -->
                <div style="
                  background: #f3f4f6;
                  padding: 25px;
                  text-align: center;
                  color: #6b7280;
                ">

                  © 2026 MAFE Beauty

                </div>

              </div>

            </div>
          `,
        });

      } catch (emailError) {

        console.error(
          "Error email pedido:",
          emailError
        );
      }

      // =====================================
      // RESPUESTA
      // =====================================

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
// OBTENER TODOS LOS PEDIDOS (ADMIN)
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
// OBTENER PEDIDOS DEL USUARIO LOGUEADO
// =====================================

export const obtenerMisPedidos =
  async (req, res) => {

    try {

      const idUsuario =
        req.usuario.id;

      const [rows] =
        await pool.query(
          `
          SELECT
            id_pedido,
            total,
            estado,
            direccion_envio,
            fecha

          FROM pedidos

          WHERE id_usuario = ?

          ORDER BY fecha DESC
          `,
          [idUsuario]
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo pedidos",
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

      res.json({

        id_pedido:
          pedidoRows[0].id_pedido,

        total:
          pedidoRows[0].total,

        estado:
          pedidoRows[0].estado,

        direccion_envio:
          pedidoRows[0].direccion_envio,

        fecha:
          pedidoRows[0].fecha,

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

      const [productos] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM productos
          `
        );

      const [pedidos] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM pedidos
          `
        );

      const [usuarios] =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM usuarios
          `
        );

      const [ventas] =
        await pool.query(
          `
          SELECT SUM(total) AS total
          FROM pedidos
          `
        );

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

      const [stockBajo] =
        await pool.query(
          `
          SELECT
            id_producto,
            nombre,
            stock

          FROM productos

          WHERE stock > 0
          AND stock <= 5

          ORDER BY stock ASC
          `
        );

      const [agotados] =
        await pool.query(
          `
          SELECT
            id_producto,
            nombre

          FROM productos

          WHERE stock <= 0
          `
        );

      const [pendientes] =
        await pool.query(
          `
          SELECT COUNT(*) AS total

          FROM pedidos

          WHERE estado = 'pendiente'
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

        pedidosPendientes:
          pendientes[0].total,

        productosStockBajo:
          stockBajo,

        productosAgotados:
          agotados,

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