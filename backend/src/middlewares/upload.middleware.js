import multer from 'multer';
import {randomUUID} from 'node:crypto';
import {writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {config} from '../config/env.js';
import {HttpError} from '../utils/errors.js';
const extensions={'image/jpeg':'.jpg','image/jpg':'.jpg','image/png':'.png','image/webp':'.webp'};
const parser=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1,fields:12,fieldSize:64*1024},
  fileFilter(req,file,cb){cb(extensions[file.mimetype]?null:new HttpError(400,'Formato de imagen no permitido'),!!extensions[file.mimetype]);}});
function signature(b,m) {
  if(m==='image/jpeg'||m==='image/jpg') return b.length>=3&&b[0]===255&&b[1]===216&&b[2]===255;
  if(m==='image/png') return b.length>=8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  return m==='image/webp'&&b.length>=12&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
}
export const upload={single(field){return(req,res,next)=>parser.single(field)(req,res,async error=>{
  if(error)return next(error);if(!req.file)return next();
  try {
    if(!signature(req.file.buffer,req.file.mimetype))throw new HttpError(400,'El contenido no corresponde a una imagen admitida');
    const filename=randomUUID()+extensions[req.file.mimetype],filePath=path.join(config.uploadDir,filename);
    await writeFile(filePath,req.file.buffer,{flag:'wx'});
    req.file.filename=filename;req.file.path=filePath;delete req.file.buffer;
    res.once('finish',()=>{if(res.statusCode>=400)unlink(filePath).catch(()=>{});});
    next();
  }catch(e){next(e);}
});}};
