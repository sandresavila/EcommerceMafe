import jwt from 'jsonwebtoken';
import {pool} from '../config/db.js';
import {config} from '../config/env.js';
export const verificarToken=async(req,res,next)=>{
  const match=/^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
  if(!match) return res.status(401).json({mensaje:'Token requerido o inválido'});
  let decoded;
  try {decoded=jwt.verify(match[1],config.jwtSecret,{algorithms:['HS256']});}
  catch {return res.status(401).json({mensaje:'Token inválido o expirado'});}
  if(!Number.isSafeInteger(decoded.id)||decoded.id<=0) return res.status(401).json({mensaje:'Token inválido'});
  try {
    const [rows]=await pool.query('SELECT id_usuario,rol,activo FROM usuarios WHERE id_usuario=?',[decoded.id]);
    if(!rows[0]||!rows[0].activo) return res.status(401).json({mensaje:'Usuario no disponible'});
    req.usuario={id:rows[0].id_usuario,rol:rows[0].rol}; next();
  } catch(error) {next(error);}
};
