import { pool } from "../config/db.js";

// =====================================
// VENTAS MENSUALES
// =====================================

export const ventasMensuales =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            MONTH(fecha) AS mes,
            SUM(total) AS total

          FROM pedidos

          WHERE estado != 'cancelado'

          GROUP BY MONTH(fecha)

          ORDER BY mes ASC
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo ventas mensuales",
      });
    }
  };

// =====================================
// PEDIDOS POR ESTADO
// =====================================

export const pedidosPorEstado =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            estado,
            COUNT(*) AS total

          FROM pedidos

          GROUP BY estado
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo pedidos por estado",
      });
    }
  };

// =====================================
// PRODUCTOS MÁS VENDIDOS
// =====================================

export const productosMasVendidos =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            p.nombre,
            SUM(pd.cantidad) AS total_vendidos

          FROM pedido_detalle pd

          INNER JOIN productos p
          ON pd.id_producto = p.id_producto

          GROUP BY pd.id_producto

          ORDER BY total_vendidos DESC

          LIMIT 10
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo productos más vendidos",
      });
    }
  };

// =====================================
// USUARIOS NUEVOS POR MES
// =====================================

export const usuariosNuevos =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            MONTH(fecha_registro) AS mes,
            COUNT(*) AS total

          FROM usuarios

          GROUP BY MONTH(fecha_registro)

          ORDER BY mes ASC
          `
        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo usuarios nuevos",
      });
    }
  };