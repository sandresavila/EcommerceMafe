import {logError} from './utils/errors.js';
try {
  const {default:app}=await import('./app.js');
  const {config}=await import('./config/env.js');
  const {pool}=await import('./config/db.js');
  const server=app.listen(config.port,'0.0.0.0',()=>console.log('Servidor listo en puerto '+config.port));
  server.on('error',error=>{logError(error);process.exitCode=1;});
  const shutdown=()=>{
    server.close(async()=>{await pool.end();process.exit(0);});
    setTimeout(()=>process.exit(1),10000).unref();
  };
  process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
}catch(error){logError(error);console.error('Revisar las variables de configuración requeridas');process.exitCode=1;}
