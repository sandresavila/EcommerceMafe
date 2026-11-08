import {HttpError} from './errors.js';
export function positiveInteger(value,name) {
  if(!Number.isSafeInteger(value)||value<=0||value>2147483647) throw new HttpError(400,name+' debe ser un entero positivo');
  return value;
}
export function normalizeItems(items) {
  if(!Array.isArray(items)||!items.length||items.length>100)throw new HttpError(400,'El pedido requiere entre 1 y 100 líneas');
  const merged=new Map();
  for(const item of items) {
    if(!item||typeof item!=='object')throw new HttpError(400,'Producto inválido');
    const id=positiveInteger(item.id_producto,'Producto'),quantity=positiveInteger(item.cantidad,'Cantidad');
    const sum=(merged.get(id)||0)+quantity;
    if(sum>10000)throw new HttpError(400,'Cantidad máxima por producto: 10000');
    merged.set(id,sum);
  }
  return [...merged].sort(([a],[b])=>a-b).map(([id_producto,cantidad])=>({id_producto,cantidad}));
}
export function cents(value) {
  const s=String(value);
  if(!/^\d{1,8}(\.\d{1,2})?$/.test(s))throw new HttpError(400,'Precio de catálogo inválido');
  const [whole,fraction='']=s.split('.');
  return Number(whole)*100+Number(fraction.padEnd(2,'0'));
}
export const money=n=>(n/100).toFixed(2);
export function calculateTotals(subtotalCents) {
  const shippingCents=subtotalCents>20000000?0:1200000; // Existing frontend rule: strictly above COP 200,000.
  const totalCents=subtotalCents+shippingCents;
  if(!Number.isSafeInteger(totalCents)||totalCents>9999999999)throw new HttpError(400,'El pedido supera el importe permitido');
  return {subtotal:money(subtotalCents),envio:money(shippingCents),total:money(totalCents)};
}
