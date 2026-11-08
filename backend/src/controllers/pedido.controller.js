import {logError} from '../utils/errors.js';
import {HttpError} from '../utils/errors.js';
import {normalizeItems,cents,money,calculateTotals} from '../utils/orderValidation.js';
import { pool } from "../config/db.js";

import {
  transporter,
} from "../utils/mailer.js";

import {
  getStoreUrl,
  orderCreatedEmailTemplate,
  orderStatusEmailTemplate,
} from "../utils/emailTemplates.js";

// =====================================
// CREAR PEDIDO
// =====================================

export const crearPedido = async (req,res,next) => {
  let connection,committed=false,order;
  try {
    const items=normalizeItems(req.body?.productos);
    const direccion=req.body?.direccion_envio;
    if(typeof direccion!=='string'||!direccion.trim()||direccion.trim().length>2000)throw new HttpError(400,'La dirección es obligatoria y no debe superar 2000 caracteres');
    connection=await pool.getConnection();
    await connection.beginTransaction();
    const [users]=await connection.query('SELECT nombre,correo,activo FROM usuarios WHERE id_usuario=?',[req.usuario.id]);
    if(!users[0]?.activo)throw new HttpError(401,'Usuario no disponible');
    const productos=[];let subtotalCents=0;
    // Stable lock order and row locks prevent overselling, including duplicate lines.
    for(const item of items) {
      const [rows]=await connection.query('SELECT id_producto,nombre,precio,stock FROM productos WHERE id_producto=? FOR UPDATE',[item.id_producto]);
      const p=rows[0];if(!p)throw new HttpError(404,'Producto no encontrado');
      if(p.stock<item.cantidad)throw new HttpError(409,'Stock insuficiente');
      const priceCents=cents(p.precio);subtotalCents+=priceCents*item.cantidad;
      productos.push({...item,nombre:p.nombre,precio:money(priceCents)});
    }
    const totals=calculateTotals(subtotalCents);
    const [created]=await connection.query('INSERT INTO pedidos (id_usuario,total,direccion_envio) VALUES (?,?,?)',[req.usuario.id,totals.total,direccion.trim()]);
    for(const item of productos) {
      const [changed]=await connection.query('UPDATE productos SET stock=stock-? WHERE id_producto=? AND stock>=?',[item.cantidad,item.id_producto,item.cantidad]);
      if(changed.affectedRows!==1)throw new HttpError(409,'Stock insuficiente');
      await connection.query('INSERT INTO pedido_detalle (id_pedido,id_producto,cantidad,precio_unitario) VALUES (?,?,?,?)',[created.insertId,item.id_producto,item.cantidad,item.precio]);
    }
    await connection.commit();committed=true;
    order={id:created.insertId,usuario:users[0],productos,direccion:direccion.trim(),...totals};
  }catch(error){
    if(connection&&!committed)try{await connection.rollback();}catch(rollbackError){logError(rollbackError);}
    return next(error);
  }finally{connection?.release();}
  try {
    await transporter.sendMail({from:'"MAFE Beauty" <'+process.env.EMAIL_USER+'>',to:order.usuario.correo,subject:'Pedido #'+order.id+' creado en MAFE Beauty',
      html:orderCreatedEmailTemplate({idPedido:order.id,nombre:order.usuario.nombre,direccion:order.direccion,productos:order.productos,total:order.total,orderUrl:getStoreUrl()+'/pedido/'+order.id})});
  }catch(error){logError(error);}
  res.status(201).json({message:'Pedido creado',id_pedido:order.id,subtotal:order.subtotal,envio:order.envio,total:order.total});
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
            u.nombre AS usuario_nombre,
            u.correo AS usuario_correo,
            u.telefono AS usuario_telefono

          FROM pedidos p

          INNER JOIN usuarios u
          ON p.id_usuario = u.id_usuario

          ORDER BY p.fecha DESC
          `
        );

      res.json(rows);

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error interno del servidor",
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

      logError(error);

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

      if (req.usuario.rol !== 'admin' && pedidoRows[0].id_usuario !== req.usuario.id) return res.status(404).json({message:'Pedido no encontrado'});

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

      const [usuarioRows] =
        await pool.query(
          `
          SELECT
            u.nombre,
            u.correo,
            u.telefono

          FROM pedidos p

          INNER JOIN usuarios u
          ON p.id_usuario = u.id_usuario

          WHERE p.id_pedido = ?
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

        usuario:
          usuarioRows[0] || null,

        productos,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error interno del servidor",
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

      const estadosPermitidos = [
        "pendiente",
        "pagado",
        "preparando",
        "enviado",
        "entregado",
        "cancelado",
      ];

      if (
        !estadosPermitidos.includes(
          estado
        )
      ) {

        return res.status(400).json({
          message:
            "Estado inválido",
        });
      }

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

      const [pedidoRows] =
        await pool.query(
          `
          SELECT
            p.id_pedido,
            p.total,
            p.estado,
            p.direccion_envio,
            u.nombre AS usuario_nombre,
            u.correo AS usuario_correo

          FROM pedidos p

          INNER JOIN usuarios u
          ON p.id_usuario = u.id_usuario

          WHERE p.id_pedido = ?
          `,
          [id]
        );

      if (
        pedidoRows.length > 0
      ) {

        const pedido =
          pedidoRows[0];

        try {

          await transporter.sendMail({

            from:
              `"MAFE Beauty" <${process.env.EMAIL_USER}>`,

            to:
              pedido.usuario_correo,

            subject:
              `Pedido #${pedido.id_pedido}: ${pedido.estado}`,

            html:
              orderStatusEmailTemplate({
                idPedido:
                  pedido.id_pedido,

                nombre:
                  pedido.usuario_nombre,

                estado:
                  pedido.estado,

                direccion:
                  pedido.direccion_envio,

                total:
                  pedido.total,

                orderUrl:
                  `${getStoreUrl()}/pedido/${pedido.id_pedido}`,
              }),
          });

        } catch (emailError) {

          logError(emailError);
        }
      }

      res.json({
        message:
          "Estado actualizado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error interno del servidor",
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

      const [ventasMes] =
        await pool.query(
          `
          SELECT SUM(total) AS total

          FROM pedidos

          WHERE MONTH(fecha) = MONTH(CURRENT_DATE())
          AND YEAR(fecha) = YEAR(CURRENT_DATE())
          `
        );

      const [ventasHoy] =
        await pool.query(
          `
          SELECT SUM(total) AS total

          FROM pedidos

          WHERE DATE(fecha) = CURRENT_DATE()
          `
        );

      const [ticketPromedio] =
        await pool.query(
          `
          SELECT AVG(total) AS total
          FROM pedidos
          `
        );

      const [pedidosPorEstado] =
        await pool.query(
          `
          SELECT
            estado,
            COUNT(*) AS total

          FROM pedidos

          GROUP BY estado
          `
        );

      const [topProductos] =
        await pool.query(
          `
          SELECT
            pr.id_producto,
            pr.nombre,
            pr.imagen_url,
            SUM(pd.cantidad) AS unidades_vendidas,
            SUM(pd.cantidad * pd.precio_unitario) AS total_vendido

          FROM pedido_detalle pd

          INNER JOIN productos pr
          ON pd.id_producto = pr.id_producto

          GROUP BY
            pr.id_producto,
            pr.nombre,
            pr.imagen_url

          ORDER BY unidades_vendidas DESC

          LIMIT 5
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

        ventasMes:
          ventasMes[0].total || 0,

        ventasHoy:
          ventasHoy[0].total || 0,

        ticketPromedio:
          ticketPromedio[0].total || 0,

        pedidosPendientes:
          pendientes[0].total,

        pedidosPorEstado,

        topProductos,

        productosStockBajo:
          stockBajo,

        productosAgotados:
          agotados,

        ultimosPedidos,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message:
          "Error interno del servidor",
      });
    }
  };
