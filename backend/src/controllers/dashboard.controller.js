import { pool } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Resumen de KPIs (Ventas totales, pedidos activos, clientes únicos)
    const [kpis] = await pool.query(`
      SELECT 
        (SELECT SUM(total) FROM pedidos WHERE estado IN ('pagado', 'entregado')) as ingresosTotales,
        (SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente') as pedidosPendientes,
        (SELECT COUNT(DISTINCT cliente_id) FROM pedidos) as totalClientes
    `);

    // 2. Ventas por día (últimos 7 días)
    const [ventasPorDia] = await pool.query(`
      SELECT DATE(fecha) as fecha, SUM(total) as total
      FROM pedidos
      WHERE estado IN ('pagado', 'entregado')
      GROUP BY DATE(fecha)
      ORDER BY fecha DESC
      LIMIT 7
    `);

    // 3. Distribución de Estados (para gráfica de pastel)
    const [estados] = await pool.query(`
      SELECT estado, COUNT(*) as cantidad
      FROM pedidos
      GROUP BY estado
    `);

    res.json({
      summary: kpis[0],
      salesHistory: ventasPorDia.reverse(),
      statusDistribution: estados
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
  }
};