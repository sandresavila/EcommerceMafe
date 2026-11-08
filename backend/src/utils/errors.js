export class HttpError extends Error {
  constructor(status,message) { super(message); this.status=status; this.expose=true; }
}
export function logError(error) {
  console.error('Error de operación',{code:/^[A-Z0-9_]+$/.test(error?.code || '') ? error.code : 'INTERNAL_ERROR'});
}
export function errorHandler(error,req,res,next) {
  if (res.headersSent) return next(error);
  let status=500,message='Error interno del servidor';
  if(error.code==='LIMIT_FILE_SIZE') {status=413;message='La imagen supera 5 MB';}
  else if(error.name==='MulterError') {status=400;message='Carga de archivo inválida';}
  else if(error.type==='entity.too.large') {status=413;message='Solicitud demasiado grande';}
  else if(error.type==='entity.parse.failed') {status=400;message='JSON inválido';}
  else if(error.expose && error.status>=400 && error.status<500) {status=error.status;message=error.message;}
  if(status>=500) logError(error);
  res.status(status).json({message,mensaje:message});
}
