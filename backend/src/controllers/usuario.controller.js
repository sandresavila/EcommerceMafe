import {logError} from '../utils/errors.js';
import { pool } from "../config/db.js";

import bcrypt from "bcryptjs";

// =====================================
// OBTENER TODOS LOS USUARIOS
// =====================================

export const obtenerUsuarios =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            id_usuario,
            nombre,
            correo,
            telefono,
            direccion,
            rol,
            activo,
            ultimo_login,
            fecha_registro

          FROM usuarios

          ORDER BY fecha_registro DESC
          `
        );

      res.json(rows);

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error al obtener usuarios",
      });
    }
  };

// =====================================
// OBTENER USUARIO
// =====================================

export const obtenerUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const [rows] =
        await pool.query(
          `
          SELECT
            id_usuario,
            nombre,
            correo,
            telefono,
            direccion,
            rol,
            activo,
            ultimo_login,
            fecha_registro

          FROM usuarios

          WHERE id_usuario = ?
          `,
          [id]
        );

      if (
        rows.length === 0
      ) {

        return res.status(404).json({
          mensaje:
            "Usuario no encontrado",
        });
      }

      res.json(rows[0]);

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error al obtener usuario",
      });
    }
  };

// =====================================
// CREAR USUARIO
// =====================================

export const crearUsuario =
  async (req, res) => {

    try {

      const {
        nombre,
        correo,
        password,
        telefono,
        direccion,
        rol,
      } = req.body;

      // =====================================
      // VALIDAR EXISTENCIA
      // =====================================

      const [usuarioExistente] =
        await pool.query(
          `
          SELECT id_usuario

          FROM usuarios

          WHERE correo = ?
          `,
          [correo]
        );

      if (
        usuarioExistente.length > 0
      ) {

        return res.status(400).json({
          mensaje:
            "El correo ya existe",
        });
      }

      // =====================================
      // ENCRIPTAR PASSWORD
      // =====================================

      const salt =
        await bcrypt.genSalt(10);

      const passwordHash =
        await bcrypt.hash(
          password,
          salt
        );

      // =====================================
      // INSERT
      // =====================================

      const [result] =
        await pool.query(
          `
          INSERT INTO usuarios
          (
            nombre,
            correo,
            password,
            telefono,
            direccion,
            rol
          )

          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            nombre,
            correo,
            passwordHash,
            telefono,
            direccion,
            rol || "cliente",
          ]
        );

      res.status(201).json({

        mensaje:
          "Usuario creado",

        id_usuario:
          result.insertId,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error al crear usuario",
      });
    }
  };

// =====================================
// ACTUALIZAR USUARIO
// =====================================

export const actualizarUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        nombre,
        telefono,
        direccion,
      } = req.body;

      await pool.query(
        `
        UPDATE usuarios

        SET
          nombre = ?,
          telefono = ?,
          direccion = ?

        WHERE id_usuario = ?
        `,
        [
          nombre,
          telefono,
          direccion,
          id,
        ]
      );

      res.json({
        mensaje:
          "Usuario actualizado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error al actualizar usuario",
      });
    }
  };

// =====================================
// CAMBIAR ROL
// =====================================

export const cambiarRolUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const { rol } =
        req.body;

      // VALIDAR ROL
      if (
        rol !== "admin" &&
        rol !== "cliente"
      ) {

        return res.status(400).json({
          mensaje:
            "Rol inválido",
        });
      }

      await pool.query(
        `
        UPDATE usuarios

        SET rol = ?

        WHERE id_usuario = ?
        `,
        [
          rol,
          id,
        ]
      );

      res.json({
        mensaje:
          "Rol actualizado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error cambiando rol",
      });
    }
  };

// =====================================
// BLOQUEAR USUARIO
// =====================================

export const bloquearUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        UPDATE usuarios

        SET activo = 0

        WHERE id_usuario = ?
        `,
        [id]
      );

      res.json({
        mensaje:
          "Usuario bloqueado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error bloqueando usuario",
      });
    }
  };

// =====================================
// ACTIVAR USUARIO
// =====================================

export const activarUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        UPDATE usuarios

        SET activo = 1

        WHERE id_usuario = ?
        `,
        [id]
      );

      res.json({
        mensaje:
          "Usuario activado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error activando usuario",
      });
    }
  };

// =====================================
// ELIMINAR USUARIO
// =====================================

export const eliminarUsuario =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // VALIDAR EXISTENCIA
      const [rows] =
        await pool.query(
          `
          SELECT rol

          FROM usuarios

          WHERE id_usuario = ?
          `,
          [id]
        );

      if (
        rows.length === 0
      ) {

        return res.status(404).json({
          mensaje:
            "Usuario no encontrado",
        });
      }

      // EVITAR ELIMINAR ADMINS
      if (
        rows[0].rol === "admin"
      ) {

        return res.status(400).json({
          mensaje:
            "No puedes eliminar administradores",
        });
      }

      await pool.query(
        `
        DELETE FROM usuarios

        WHERE id_usuario = ?
        `,
        [id]
      );

      res.json({
        mensaje:
          "Usuario eliminado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error al eliminar usuario",
      });
    }
  };

// =====================================
// PERFIL USUARIO LOGUEADO
// =====================================

export const obtenerPerfil =
  async (req, res) => {

    try {

      const id_usuario =
        req.usuario.id;

      const [rows] =
        await pool.query(
          `
          SELECT
            id_usuario,
            nombre,
            correo,
            telefono,
            direccion,
            rol,
            activo,
            ultimo_login,
            fecha_registro

          FROM usuarios

          WHERE id_usuario = ?
          `,
          [id_usuario]
        );

      if (
        rows.length === 0
      ) {

        return res.status(404).json({
          mensaje:
            "Usuario no encontrado",
        });
      }

      res.json(rows[0]);

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error obteniendo perfil",
      });
    }
  };

// =====================================
// ACTUALIZAR PERFIL
// =====================================

export const actualizarPerfil =
  async (req, res) => {

    try {

      const id_usuario =
        req.usuario.id;

      const {
        nombre,
        telefono,
        direccion,
      } = req.body;

      await pool.query(
        `
        UPDATE usuarios

        SET
          nombre = ?,
          telefono = ?,
          direccion = ?

        WHERE id_usuario = ?
        `,
        [
          nombre,
          telefono,
          direccion,
          id_usuario,
        ]
      );

      res.json({
        mensaje:
          "Perfil actualizado",
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        mensaje:
          "Error actualizando perfil",
      });
    }
  };