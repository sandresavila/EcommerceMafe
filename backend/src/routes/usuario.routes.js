import { Router } from "express";

import {

  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,

  obtenerPerfil,
  actualizarPerfil,

  cambiarRolUsuario,
  bloquearUsuario,
  activarUsuario,

} from "../controllers/usuario.controller.js";

import {

  verificarToken,

} from "../middlewares/auth.middleware.js";

import {

  esAdmin,

} from "../middlewares/role.middleware.js";

const router = Router();

// =====================================
// PERFIL USUARIO LOGUEADO
// =====================================

router.get(
  "/perfil",
  verificarToken,
  obtenerPerfil
);

router.put(
  "/perfil",
  verificarToken,
  actualizarPerfil
);

// =====================================
// ADMIN - OBTENER TODOS
// =====================================

router.get(
  "/",
  verificarToken,
  esAdmin,
  obtenerUsuarios
);

// =====================================
// ADMIN - OBTENER UNO
// =====================================

router.get(
  "/:id",
  verificarToken,
  esAdmin,
  obtenerUsuario
);

// =====================================
// ADMIN - CREAR
// =====================================

router.post(
  "/",
  verificarToken,
  esAdmin,
  crearUsuario
);

// =====================================
// ADMIN - ACTUALIZAR
// =====================================

router.put(
  "/:id",
  verificarToken,
  esAdmin,
  actualizarUsuario
);

// =====================================
// ADMIN - CAMBIAR ROL
// =====================================

router.put(
  "/:id/rol",
  verificarToken,
  esAdmin,
  cambiarRolUsuario
);

// =====================================
// ADMIN - BLOQUEAR
// =====================================

router.put(
  "/:id/bloquear",
  verificarToken,
  esAdmin,
  bloquearUsuario
);

// =====================================
// ADMIN - ACTIVAR
// =====================================

router.put(
  "/:id/activar",
  verificarToken,
  esAdmin,
  activarUsuario
);

// =====================================
// ADMIN - ELIMINAR
// =====================================

router.delete(
  "/:id",
  verificarToken,
  esAdmin,
  eliminarUsuario
);

export default router;