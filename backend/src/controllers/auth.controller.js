import { pool } from "../config/db.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ? AND password = ?", 
      [correo, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0].nombre });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};