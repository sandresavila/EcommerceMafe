import { pool } from "../config/db.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import {
  transporter,
} from "../utils/mailer.js";

// =====================================
// REGISTRO
// =====================================

export const register =
  async (req, res) => {

    try {

      const {
        nombre,
        correo,
        password,
        telefono,
        direccion,
      } = req.body;

      // =====================================
      // VALIDAR CORREO EXISTENTE
      // =====================================

      const [usuarioExistente] =
        await pool.query(
          `
          SELECT *

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
            "El correo ya está registrado",
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
      // GUARDAR USUARIO
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
            direccion
          )

          VALUES (?, ?, ?, ?, ?)
          `,
          [
            nombre,
            correo,
            passwordHash,
            telefono,
            direccion,
          ]
        );

      // =====================================
      // EMAIL BIENVENIDA
      // =====================================

      try {

        await transporter.sendMail({

          from:
            `"MAFE Beauty" <${process.env.EMAIL_USER}>`,

          to: correo,

          subject:
            "✨ Bienvenido a MAFE Beauty",

          html: `
            <div style="
              font-family: Arial, sans-serif;
              background: #f9fafb;
              padding: 40px;
            ">

              <div style="
                max-width: 600px;
                margin: auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              ">

                <!-- HEADER -->
                <div style="
                  background: linear-gradient(
                    135deg,
                    #ec4899,
                    #f472b6
                  );
                  padding: 40px;
                  text-align: center;
                  color: white;
                ">

                  <h1 style="
                    margin: 0;
                    font-size: 36px;
                  ">
                    MAFE Beauty ✨
                  </h1>

                  <p style="
                    margin-top: 10px;
                    font-size: 18px;
                  ">
                    Bienvenido a nuestra tienda
                  </p>

                </div>

                <!-- BODY -->
                <div style="
                  padding: 40px;
                  color: #374151;
                ">

                  <h2 style="
                    color: #ec4899;
                    margin-bottom: 20px;
                  ">
                    ¡Hola ${nombre}! 💖
                  </h2>

                  <p style="
                    font-size: 16px;
                    line-height: 1.7;
                  ">
                    Gracias por registrarte
                    en <strong>MAFE Beauty</strong>.
                  </p>

                  <p style="
                    font-size: 16px;
                    line-height: 1.7;
                  ">
                    Ya puedes:
                  </p>

                  <ul style="
                    line-height: 2;
                    padding-left: 20px;
                  ">

                    <li>
                      Comprar productos
                    </li>

                    <li>
                      Guardar favoritos ❤️
                    </li>

                    <li>
                      Gestionar pedidos 📦
                    </li>

                    <li>
                      Recibir asesoría ✨
                    </li>

                  </ul>

                  <!-- BTN -->
                  <div style="
                    margin-top: 40px;
                    text-align: center;
                  ">

                    <a
                      href="http://localhost:3000"
                      style="
                        background: #ec4899;
                        color: white;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 14px;
                        font-weight: bold;
                        display: inline-block;
                      "
                    >
                      Ir a la tienda
                    </a>

                  </div>

                </div>

                <!-- FOOTER -->
                <div style="
                  padding: 25px;
                  text-align: center;
                  background: #f3f4f6;
                  color: #6b7280;
                  font-size: 14px;
                ">

                  © 2026 MAFE Beauty

                </div>

              </div>

            </div>
          `,
        });

      } catch (emailError) {

        console.error(
          "Error enviando email:",
          emailError
        );
      }

      // =====================================
      // RESPUESTA
      // =====================================

      res.status(201).json({

        mensaje:
          "Usuario registrado",

        id_usuario:
          result.insertId,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        mensaje:
          "Error en el registro",
      });
    }
  };

// =====================================
// LOGIN
// =====================================

export const login =
  async (req, res) => {

    try {

      const {
        correo,
        password,
      } = req.body;

      // =====================================
      // BUSCAR USUARIO
      // =====================================

      const [rows] =
        await pool.query(
          `
          SELECT *

          FROM usuarios

          WHERE correo = ?
          `,
          [correo]
        );

      if (
        rows.length === 0
      ) {

        return res.status(400).json({

          mensaje:
            "Correo o contraseña incorrectos",
        });
      }

      const usuario =
        rows[0];

      // =====================================
      // VALIDAR PASSWORD
      // =====================================

      const passwordValido =
        await bcrypt.compare(
          password,
          usuario.password
        );

      if (!passwordValido) {

        return res.status(400).json({

          mensaje:
            "Correo o contraseña incorrectos",
        });
      }

      // =====================================
      // TOKEN
      // =====================================

      const token =
        jwt.sign(
          {
            id:
              usuario.id_usuario,

            rol:
              usuario.rol,
          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "7d",
          }
        );

      // =====================================
      // RESPUESTA
      // =====================================

      res.json({

        mensaje:
          "Login exitoso",

        token,

        usuario: {

          id:
            usuario.id_usuario,

          nombre:
            usuario.nombre,

          correo:
            usuario.correo,

          rol:
            usuario.rol,
        },
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        mensaje:
          "Error en el login",
      });
    }
  };