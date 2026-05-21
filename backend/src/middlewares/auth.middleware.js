import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    // Obtener header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: "Token requerido",
      });
    }

    // Formato:
    // Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        mensaje: "Token inválido",
      });
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Guardar usuario decodificado
    req.usuario = decoded;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};