import { pool } from "../config/db.js";

export const getPedidos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, u.nombre AS nombre_cliente 
            FROM pedidos p 
            JOIN usuarios u ON p.id_usuario = u.id_usuario
        `);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const actualizarEstadoPedido = async (req, res) => {
    // 1. Forzamos la captura del ID de cualquier parte de la petición
    const id = req.params.id || req.body.id || req.body.id_pedido;
    const { estado } = req.body; 

    // Log 
    console.log(`Petición recibida: ID=${id}, Estado=${estado}`);

    if (!id || !estado) {
        return res.status(400).json({ message: "ID o Estado faltantes en la petición" });
    }

    try {
        const [result] = await pool.query(
            "UPDATE pedidos SET estado = ? WHERE id_pedido = ?",
            [estado, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Error: No se encontró el pedido en la DB" });
        }

        return res.json({ message: "Actualizado correctamente" });
    } catch (error) {
        console.error("Error SQL:", error);
        return res.status(500).json({ message: "Error de SQL: " + error.message });
    }
};

// Dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const [kpis] = await pool.query(`
            SELECT 
                IFNULL(SUM(total), 0) as ingresosTotales,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente') as pedidosPendientes,
                (SELECT COUNT(DISTINCT id_usuario) FROM pedidos) as totalClientes
            FROM pedidos 
        `);

        const [ventasPorDia] = await pool.query(`
            SELECT DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, IFNULL(SUM(total), 0) as total
            FROM pedidos
            WHERE estado IN ('pagado', 'entregado')
            GROUP BY DATE(fecha)
            ORDER BY fecha DESC LIMIT 7
        `);

        const [estados] = await pool.query(`
            SELECT estado, COUNT(*) as cantidad FROM pedidos GROUP BY estado
        `);

        res.json({
            summary: kpis[0],
            salesHistory: ventasPorDia.reverse(),
            statusDistribution: estados
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};