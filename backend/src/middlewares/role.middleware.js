export const esAdmin = (req, res, next) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "Acceso denegado",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en autorización",
    });
  }
};