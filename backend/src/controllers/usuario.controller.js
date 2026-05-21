import { pool } from "../config/db.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, correo, rol, fecha_registro FROM usuarios"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
    });
  }
};

// Obtener un usuario
export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener usuario",
    });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, telefono, direccion } = req.body;

    const [result] = await pool.query(
      `INSERT INTO usuarios 
      (nombre, correo, password, telefono, direccion)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, correo, password, telefono, direccion]
    );

    res.status(201).json({
      mensaje: "Usuario creado",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al crear usuario",
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, telefono, direccion } = req.body;

    await pool.query(
      `UPDATE usuarios 
      SET nombre = ?, telefono = ?, direccion = ?
      WHERE id_usuario = ?`,
      [nombre, telefono, direccion, id]
    );

    res.json({
      mensaje: "Usuario actualizado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
    });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    res.json({
      mensaje: "Usuario eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar usuario",
    });
  }
};