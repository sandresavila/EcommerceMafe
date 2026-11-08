import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import {config} from './config/env.js';
import {pool} from './config/db.js';
import {HttpError,errorHandler} from './utils/errors.js';
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import productoRoutes from './routes/producto.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import favoritoRoutes from './routes/favoritos.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app=express();
fs.mkdirSync(config.uploadDir,{recursive:true});
app.disable('x-powered-by');
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');next();});
app.use(cors({origin(origin,cb){
  if(!origin||config.corsOrigins.includes(origin))return cb(null,true);
  cb(new HttpError(403,'Origen no permitido'));
},methods:['GET','POST','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
app.use(express.json({limit:'256kb'}));
app.get('/health',(req,res)=>res.json({status:'ok'}));
app.get('/health/ready',async(req,res)=>{
  let connection;
  try {
    connection=await pool.getConnection();await connection.query('SELECT 1');
    await fs.promises.access(config.uploadDir,fs.constants.R_OK|fs.constants.W_OK);
    res.json({status:'ready'});
  }catch{res.status(503).json({status:'unavailable'});}
  finally{connection?.release();}
});
app.use('/uploads',express.static(config.uploadDir,{dotfiles:'deny',index:false}));
for(const [prefix,routes]of Object.entries({auth:authRoutes,usuarios:usuarioRoutes,productos:productoRoutes,carrito:carritoRoutes,pedidos:pedidoRoutes,categorias:categoriaRoutes,favoritos:favoritoRoutes,analytics:analyticsRoutes}))
  app.use('/api/'+prefix,routes);
app.use((req,res)=>res.status(404).json({message:'Ruta no encontrada'}));
app.use(errorHandler);
export default app;
