import nodemailer from 'nodemailer';
import {config} from '../config/env.js';

/**
 * No transport is constructed when disabled. Never log message contents or recipients.
 * The enabled path retains Gmail SMTP; NODE_ENV=test uses an in-memory JSON transport.
 */
export function createMailer({
  enabled=config.mailEnabled,
  test=process.env.NODE_ENV==='test',
  createTransport=options=>nodemailer.createTransport(options),
  logger=message=>console.info(message),
}={}) {
  if(typeof enabled!=='boolean')throw new TypeError('El modo de correo debe ser booleano');
  if(!enabled) return {
    sendMail(message,callback) {
      logger('Correo omitido por configuración (MAIL_ENABLED=false)');
      const result={accepted:[],rejected:[],skipped:true,reason:'disabled'};
      if(typeof callback==='function') {queueMicrotask(()=>callback(null,result));return;}
      return Promise.resolve(result);
    },
  };
  return createTransport(test ? {jsonTransport:true} : {
    service:'gmail',
    auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS},
    connectionTimeout:5000,greetingTimeout:5000,socketTimeout:5000,
  });
}
export const transporter=createMailer();
