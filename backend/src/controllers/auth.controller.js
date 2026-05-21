import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTRO
export const register = async (req, res) => {
  try {
    const {
      nombre,
      correo,
      password,
      telefono,
      direccion,
    } = req.body;

    // Verificar si el correo ya existe
    const [usuarioExistente] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    // Guardar usuario
    const [result] = await pool.query(
      `INSERT INTO usuarios
      (nombre, correo, password, telefono, direccion)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, correo, passwordHash, telefono, direccion]
    );

    res.status(201).json({
      mensaje: "Usuario registrado",
      id_usuario: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en el registro",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    const usuario = rows[0];

    // Comparar contraseña
    const passwordValido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValido) {
      return res.status(400).json({
        mensaje: "Correo o contraseña incorrectos",
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en el login",
    });
  }
};