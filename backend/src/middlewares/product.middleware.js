import {HttpError} from '../utils/errors.js';
import {cents,money,positiveInteger} from '../utils/orderValidation.js';
export function validateProduct(req,res,next) {
 try {
  const b=req.body;
  if(typeof b?.nombre!=='string'||!b.nombre.trim()||b.nombre.length>150)throw new HttpError(400,'Nombre de producto inválido');
  b.nombre=b.nombre.trim();b.precio=money(cents(b.precio));
  if(b.stock===''||b.stock==null)throw new HttpError(400,'Stock inválido');
  b.stock=Number(b.stock);
  if(!Number.isSafeInteger(b.stock)||b.stock<0||b.stock>2147483647)throw new HttpError(400,'Stock inválido');
  b.id_categoria=(b.id_categoria==null||b.id_categoria==='')?null:positiveInteger(Number(b.id_categoria),'Categoría');
  const flag=b.es_distribuido;
  if(![undefined,null,true,false,'true','false',1,0,'1','0'].includes(flag))throw new HttpError(400,'Indicador de distribución inválido');
  b.es_distribuido=[true,'true',1,'1'].includes(flag)?1:0;
  next();
 }catch(error){next(error);}
}
