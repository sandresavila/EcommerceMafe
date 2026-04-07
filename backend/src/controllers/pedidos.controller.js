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
    const { id } = req.params;
    const { estado } = req.body; 
    try {
        const [result] = await pool.query(
            "UPDATE pedidos SET estado = ? WHERE id_pedido = ?",
            [estado, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "No encontrado" });
        res.json({ message: "Estado actualizado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};