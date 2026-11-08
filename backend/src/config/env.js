import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config({ quiet: true });
export function readEnvironment(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const mailFlag=env.MAIL_ENABLED ?? 'true';
  if(!['true','false'].includes(mailFlag))throw new Error('MAIL_ENABLED debe ser true o false');
  for (const name of ['DB_HOST','DB_PORT','DB_USER','DB_PASSWORD','DB_NAME','JWT_SECRET'])
    if (!env[name]) throw new Error('Falta configurar ' + name);
  if (env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET requiere al menos 32 caracteres');
  const port = Number(env.PORT || 4000), dbPort = Number(env.DB_PORT);
  for (const n of [port, dbPort]) if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error('Puerto inválido');
  const url = (name, value) => {
    let u; try { u = new URL(value); } catch { throw new Error(name + ' inválida'); }
    if (!['http:','https:'].includes(u.protocol) || u.username || u.password || u.search || u.hash || u.pathname !== '/' || (production && u.protocol !== 'https:'))
      throw new Error(name + ' debe ser un origen HTTP(S), HTTPS en producción');
    return u.origin;
  };
  const origins = (env.CORS_ORIGINS || env.FRONTEND_URL || (production ? '' : 'http://localhost:3000')).split(',').map(s=>s.trim()).filter(Boolean);
  if (!origins.length) throw new Error('Configurar CORS_ORIGINS o FRONTEND_URL');
  if (production && (!env.BACKEND_URL || !env.FRONTEND_URL)) throw new Error('Configurar BACKEND_URL y FRONTEND_URL');
  if (env.FRONTEND_URL) url('FRONTEND_URL', env.FRONTEND_URL);
  return { production, port, mailEnabled:mailFlag==='true', jwtSecret:env.JWT_SECRET,
    db:{host:env.DB_HOST,port:dbPort,user:env.DB_USER,password:env.DB_PASSWORD,database:env.DB_NAME},
    corsOrigins:origins.map(o=>url('CORS_ORIGINS',o)),
    backendUrl:env.BACKEND_URL ? url('BACKEND_URL',env.BACKEND_URL) : 'http://localhost:'+port,
    uploadDir:path.resolve(env.UPLOAD_DIR || fileURLToPath(new URL('../../uploads',import.meta.url))) };
}
export const config = readEnvironment();
