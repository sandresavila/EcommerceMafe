import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const testPort=Number(process.env.MAFE_TEST_MYSQL_PORT||33070);
assert.ok([33070,33084].includes(testPort),'Only isolated test ports are permitted');
let admin,pool,server,base,config,readEnvironment,uploads,tokenA,tokenB,tokenAdmin;
const request=async(route,{token,body,method='GET',origin,raw,headers={}}={})=>{
 const h={...headers};if(token)h.Authorization='Bearer '+token;if(origin)h.Origin=origin;if(body)h['Content-Type']='application/json';
 const r=await fetch(base+route,{method,headers:h,body:raw??(body?JSON.stringify(body):undefined)});
 return {status:r.status,headers:r.headers,body:await r.json()};
};
const product=async(price='10000.00',stock=5)=>{const[r]=await pool.query('INSERT INTO productos(nombre,precio,stock) VALUES(?,?,?)',['Producto ficticio',price,stock]);return r.insertId;};
const order=(id,cantidad=1,precio=1)=>({direccion_envio:'Dirección ficticia',productos:[{id_producto:id,cantidad,precio}]});
before(async()=>{
 admin=await mysql.createConnection({host:'127.0.0.1',port:testPort,user:'root',password:'',multipleStatements:true});
 const [[s]]=await admin.query('SELECT @@datadir AS dir,VERSION() AS version');
 assert.ok(s.dir.replaceAll('\\','/').endsWith(testPort===33084?'mysql-pruebas-84/data/':'mysql-pruebas-33/data/'));
 if(testPort===33084)assert.equal(s.version,'8.4.13');
 console.log('Isolated MySQL version:',s.version,'port:',testPort);
 const db='mafe_test_'+Date.now(),user='test_'+randomBytes(4).toString('hex'),secret=randomBytes(24).toString('hex');
 await admin.query('CREATE DATABASE `'+db+'` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci');
 await admin.query('CREATE USER ?@? IDENTIFIED BY ?',[user,'localhost',secret]);
 await admin.query('GRANT ALL PRIVILEGES ON `'+db+'`.* TO ?@?',[user,'localhost']);
 const setup=await mysql.createConnection({host:'127.0.0.1',port:testPort,user,password:secret,database:db,multipleStatements:true});
 await setup.query(await fs.readFile(new URL('./schema.sql',import.meta.url),'utf8'));await setup.end();
 uploads=await fs.mkdtemp(path.join(os.tmpdir(),'mafe-uploads-test-'));
 Object.assign(process.env,{NODE_ENV:'test',MAIL_ENABLED:'true',DB_HOST:'127.0.0.1',DB_PORT:String(testPort),DB_USER:user,DB_PASSWORD:secret,DB_NAME:db,JWT_SECRET:randomBytes(32).toString('hex'),FRONTEND_URL:'https://frontend.example',BACKEND_URL:'https://backend.example',CORS_ORIGINS:'https://frontend.example',UPLOAD_DIR:uploads});
 ({pool}=await import('../src/config/db.js'));({config,readEnvironment}=await import('../src/config/env.js'));
 const {default:app}=await import('../src/app.js');server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base='http://127.0.0.1:'+server.address().port;
 const hashed=await bcrypt.hash('test-only-password-123',4);
 for(const [id,name,rol]of [[101,'A','cliente'],[102,'B','cliente'],[103,'admin','admin']])await pool.query('INSERT INTO usuarios(id_usuario,nombre,correo,password,rol,activo) VALUES(?,?,?,?,?,1)',[id,'Persona ficticia',name+'@example.invalid',hashed,rol]);
 tokenA=jwt.sign({id:101,rol:'cliente'},config.jwtSecret,{expiresIn:'1h'});tokenB=jwt.sign({id:102,rol:'cliente'},config.jwtSecret,{expiresIn:'1h'});tokenAdmin=jwt.sign({id:103,rol:'admin'},config.jwtSecret,{expiresIn:'1h'});
});
after(async()=>{if(server)await new Promise(r=>server.close(r));if(pool)await pool.end();if(admin)await admin.end();});
test('configuration rejects missing secrets, invalid ports and unsafe production origins',()=>{
 assert.throws(()=>readEnvironment({}),/DB_HOST/);assert.throws(()=>readEnvironment({...process.env,DB_PORT:'NaN'}),/Puerto/);
 assert.throws(()=>readEnvironment({...process.env,JWT_SECRET:'short'}),/JWT_SECRET/);
 assert.throws(()=>readEnvironment({...process.env,NODE_ENV:'production',BACKEND_URL:'http://backend.example'}),/HTTPS/);
 assert.throws(()=>readEnvironment({...process.env,NODE_ENV:'production',CORS_ORIGINS:'*'}));
});
test('liveness and readiness succeed without exposing configuration',async()=>{
 assert.equal((await request('/health')).status,200);assert.deepEqual((await request('/health/ready')).body,{status:'ready'});
});
test('login works; missing, malformed, expired and wrong-algorithm tokens fail',async()=>{
 const r=await request('/api/auth/login',{method:'POST',body:{correo:'A@example.invalid',password:'test-only-password-123'}});assert.equal(r.status,200);assert.ok(r.body.token);
 for(const token of [undefined,'invalid',jwt.sign({id:101},config.jwtSecret,{expiresIn:-1}),jwt.sign({id:101},config.jwtSecret,{algorithm:'HS384'})])
 assert.equal((await request('/api/usuarios/perfil',{token})).status,401);
});
test('blocked and deleted users cannot use previous tokens or login',async()=>{
 await pool.query('UPDATE usuarios SET activo=0 WHERE id_usuario=102');
 assert.equal((await request('/api/usuarios/perfil',{token:tokenB})).status,401);
 assert.equal((await request('/api/auth/login',{method:'POST',body:{correo:'B@example.invalid',password:'test-only-password-123'}})).status,400);
 await pool.query('UPDATE usuarios SET activo=1 WHERE id_usuario=102');
 assert.equal((await request('/api/usuarios',{token:jwt.sign({id:999999,rol:'admin'},config.jwtSecret)})).status,401);
});
test('role changes apply to already issued tokens',async()=>{
 await pool.query("UPDATE usuarios SET rol='cliente' WHERE id_usuario=103");
 assert.equal((await request('/api/usuarios',{token:tokenAdmin})).status,403);
 await pool.query("UPDATE usuarios SET rol='admin' WHERE id_usuario=103");
 assert.equal((await request('/api/usuarios',{token:tokenAdmin})).status,200);
});
test('server ignores submitted prices and includes shipping in persisted total',async()=>{
 const id=await product();const r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id,2,0.01)});
 assert.equal(r.status,201);assert.equal(r.body.subtotal,'20000.00');assert.equal(r.body.envio,'12000.00');assert.equal(r.body.total,'32000.00');
 const [[p]]=await pool.query('SELECT total FROM pedidos WHERE id_pedido=?',[r.body.id_pedido]);assert.equal(p.total,'32000.00');
 const [[d]]=await pool.query('SELECT precio_unitario FROM pedido_detalle WHERE id_pedido=?',[r.body.id_pedido]);assert.equal(d.precio_unitario,'10000.00');
});
test('owner and admin read orders; other customers receive 404',async()=>{
 const id=await product();const r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});
 const route='/api/pedidos/'+r.body.id_pedido;
 assert.equal((await request(route,{token:tokenA})).status,200);assert.equal((await request(route,{token:tokenAdmin})).status,200);assert.equal((await request(route,{token:tokenB})).status,404);
});
test('invalid quantities and malformed orders never create rows',async()=>{
 const id=await product();const [[before]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');
 for(const q of [0,-1,1.5,'1',true,10001,null])assert.equal((await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id,q)})).status,400);
 for(const body of [{productos:[],direccion_envio:'x'},{productos:[null],direccion_envio:'x'},{...order(id),direccion_envio:' '}])assert.equal((await request('/api/pedidos',{method:'POST',token:tokenA,body})).status,400);
 const [[after]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');assert.equal(after.n,before.n);
});
test('duplicate lines are aggregated before stock checks',async()=>{
 const id=await product('10000.00',2),body=order(id);body.productos.push({...body.productos[0],cantidad:2});
 assert.equal((await request('/api/pedidos',{method:'POST',token:tokenA,body})).status,409);
 const [[p]]=await pool.query('SELECT stock FROM productos WHERE id_producto=?',[id]);assert.equal(p.stock,2);
});
test('concurrent purchases cannot oversell the final unit',async()=>{
 const id=await product('10000.00',1);
 const results=await Promise.all([tokenA,tokenB].map(token=>request('/api/pedidos',{method:'POST',token,body:order(id)})));
 assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
 const [[p]]=await pool.query('SELECT stock FROM productos WHERE id_producto=?',[id]);assert.equal(p.stock,0);
 const [[n]]=await pool.query('SELECT SUM(cantidad) AS total FROM pedido_detalle WHERE id_producto=?',[id]);assert.equal(Number(n.total),1);
});
test('stock failure leaves no partial order',async()=>{
 const a=await product('10000.00',2),b=await product('10000.00',0),body=order(a);body.productos.push({id_producto:b,cantidad:1});
 const [[before]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');
 assert.equal((await request('/api/pedidos',{method:'POST',token:tokenA,body})).status,409);
 const [[p]]=await pool.query('SELECT stock FROM productos WHERE id_producto=?',[a]);assert.equal(p.stock,2);
 const [[after]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');assert.equal(after.n,before.n);
});
test('shipping threshold and decimal arithmetic match frontend rules',async()=>{
 for(const [price,shipping]of [['200000.00','12000.00'],['200000.01','0.00']]){
 const id=await product(price),r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});assert.equal(r.status,201);assert.equal(r.body.envio,shipping);}
 const id=await product('0.10'),r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id,3)});assert.equal(r.body.subtotal,'0.30');
});
test('CORS allows explicit frontend, supports preflight and rejects other origins',async()=>{
 const r=await request('/health',{origin:'https://frontend.example'});assert.equal(r.headers.get('access-control-allow-origin'),'https://frontend.example');
 assert.equal((await request('/health',{origin:'https://attacker.example'})).status,403);
 const p=await fetch(base+'/api/pedidos',{method:'OPTIONS',headers:{Origin:'https://frontend.example','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'}});assert.equal(p.status,204);
});
test('cart rejects nonpositive and fractional quantities',async()=>{
 for(const cantidad of [-1,0,1.2,'2'])assert.equal((await request('/api/carrito',{method:'POST',token:tokenA,body:{id_producto:1,cantidad}})).status,400);
});
test('uploads enforce authorization, MIME, content signature and 5 MB limit',async()=>{
 const form=(bytes,mime='image/png')=>{const f=new FormData();f.set('imagen',new Blob([bytes],{type:mime}),'sample.png');f.set('nombre','Prueba');f.set('precio','1');f.set('stock','1');return f;};
 const upload=(raw,token=tokenAdmin)=>request('/api/productos',{method:'POST',token,raw});
 assert.equal((await upload(form('not-an-image'))).status,400);assert.equal((await upload(form('x','image/svg+xml'))).status,400);
 assert.equal((await upload(form(Buffer.alloc(5*1024*1024+1)))).status,413);assert.equal((await upload(form('x'),tokenA)).status,403);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6rWQAAAAASUVORK5CYII=','base64');
 const r=await upload(form(png));assert.equal(r.status,201);assert.match(r.body.imagen_url,/https:\/\/backend.example\/uploads\/[a-f0-9-]+\.png$/);
 const files=await fs.readdir(uploads);assert.equal(files.length,1);assert.deepEqual(await fs.readFile(path.join(uploads,files[0])),png);
 const image=await fetch(base+'/uploads/'+files[0]);assert.equal(image.status,200);assert.equal(image.headers.get('x-content-type-options'),'nosniff');
});
test('JSON and database errors do not disclose SQL, passwords or stack traces',async()=>{
 const bad=await request('/api/auth/login',{method:'POST',raw:'{bad',headers:{'Content-Type':'application/json'}});assert.equal(bad.status,400);assert.doesNotMatch(JSON.stringify(bad.body),/SyntaxError|stack/);
 const id=await product(),original=pool.getConnection;pool.getConnection=async()=>{throw Object.assign(new Error('password secret SQL text'),{code:'ECONNREFUSED'});};
 try{const r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});assert.equal(r.status,500);assert.doesNotMatch(JSON.stringify(r.body),/password|secret|SQL|stack/);assert.equal((await request('/health/ready')).status,503);}
 finally{pool.getConnection=original;}
});
test('server entrypoint respects dynamic port and starts successfully',async()=>{
 const child=spawn(process.execPath,['src/server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'34071'},stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',()=>{});
 try{for(let i=0;i<60&&!output.includes('Servidor listo');i++)await new Promise(r=>setTimeout(r,100));assert.match(output,/34071/);assert.equal((await fetch('http://127.0.0.1:34071/health')).status,200);}
 finally{child.kill();await new Promise(r=>child.once('exit',r));}
});

test('registration validates before writing and preserves signup flow',async()=>{
 const [[before]]=await pool.query('SELECT COUNT(*) AS n FROM usuarios');
 const bad=await request('/api/auth/register',{method:'POST',body:{nombre:'',correo:'invalid',password:'short'}});assert.equal(bad.status,400);
 const [[unchanged]]=await pool.query('SELECT COUNT(*) AS n FROM usuarios');assert.equal(unchanged.n,before.n);
 const valid=await request('/api/auth/register',{method:'POST',body:{nombre:'Cliente ficticio',correo:'signup@example.invalid',password:'signup-test-only-123'}});assert.equal(valid.status,201);
 assert.equal((await request('/api/auth/login',{method:'POST',body:{correo:'signup@example.invalid',password:'signup-test-only-123'}})).status,200);
});
test('product input validation prevents negative inventory and normalizes distribution flag',async()=>{
 const negative=await request('/api/productos',{method:'POST',token:tokenAdmin,body:{nombre:'Ficticio',precio:'1.00',stock:-1}});assert.equal(negative.status,400);
 const valid=await request('/api/productos',{method:'POST',token:tokenAdmin,body:{nombre:'Ficticio',precio:'1.00',stock:1,es_distribuido:'false'}});assert.equal(valid.status,201);
 const [[p]]=await pool.query('SELECT es_distribuido FROM productos WHERE id_producto=?',[valid.body.id_producto]);assert.equal(p.es_distribuido,0);
 const detail=await request('/api/productos/'+valid.body.id_producto);assert.equal(typeof detail.body.precio,'number');
});
test('products referenced by orders cannot be deleted, preserving history',async()=>{
 const id=await product();await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});
 assert.equal((await request('/api/productos/'+id,{method:'DELETE',token:tokenAdmin})).status,409);
 const [[n]]=await pool.query('SELECT COUNT(*) AS n FROM pedido_detalle WHERE id_producto=?',[id]);assert.equal(n.n,1);
 const unused=await product();assert.equal((await request('/api/productos/'+unused,{method:'DELETE',token:tokenAdmin})).status,200);
});
test('database failure after writes rolls back stock and order details',async()=>{
 const a=await product(),b=await product(),body=order(a);body.productos.push({id_producto:b,cantidad:1});
 const [[before]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');
 const original=pool.getConnection;
 pool.getConnection=async()=>{const c=await original.call(pool),query=c.query.bind(c);c.query=async(sql,args)=>{if(sql.startsWith('INSERT INTO pedido_detalle')&&args[1]===b)throw Object.assign(new Error('injected SQL failure'),{code:'TEST_FAILURE'});return query(sql,args);};return c;};
 try{assert.equal((await request('/api/pedidos',{method:'POST',token:tokenA,body})).status,500);}
 finally{pool.getConnection=original;}
 const [[after]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos');assert.equal(after.n,before.n);
 const [rows]=await pool.query('SELECT stock FROM productos WHERE id_producto IN (?,?)',[a,b]);assert.ok(rows.every(r=>r.stock===5));
});
test('SMTP failure after commit does not roll back or fail the accepted order',async()=>{
 const {transporter}=await import('../src/utils/mailer.js');const send=transporter.sendMail;
 transporter.sendMail=async()=>{throw Object.assign(new Error('sensitive SMTP text'),{code:'ETIMEDOUT'});};
 try{const id=await product();const r=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});assert.equal(r.status,201);const [[n]]=await pool.query('SELECT COUNT(*) AS n FROM pedidos WHERE id_pedido=?',[r.body.id_pedido]);assert.equal(n.n,1);}
 finally{transporter.sendMail=send;}
});

test('regression: public catalog, product update and categories retain their routes',async()=>{
 const created=await request('/api/categorias',{method:'POST',token:tokenAdmin,body:{nombre:'Categoría ficticia',descripcion:'Prueba aislada'}});assert.equal(created.status,201);
 const id=created.body.id_categoria;assert.equal((await request('/api/categorias/'+id)).status,200);
 assert.equal((await request('/api/categorias/'+id,{method:'PUT',token:tokenAdmin,body:{nombre:'Categoría actualizada',descripcion:'Prueba'}})).status,200);
 const p=await product();const changed=await request('/api/productos/'+p,{method:'PUT',token:tokenAdmin,body:{nombre:'Producto actualizado',precio:'123.45',stock:3,id_categoria:id,es_distribuido:false}});
 assert.equal(changed.status,200);const catalog=await request('/api/productos');assert.equal(catalog.status,200);assert.ok(catalog.body.some(row=>row.id_producto===p&&row.precio===123.45));
 assert.equal((await request('/api/categorias')).status,200);
});
test('regression: favorites remain persistent and isolated by user',async()=>{
 const id=await product();assert.equal((await request('/api/favoritos',{method:'POST',token:tokenA,body:{id_producto:id}})).status,201);
 const mine=await request('/api/favoritos',{token:tokenA}),other=await request('/api/favoritos',{token:tokenB});
 assert.ok(mine.body.some(p=>p.id_producto===id));assert.ok(!other.body.some(p=>p.id_producto===id));
});
test('regression: cart and profile retain persisted values',async()=>{
 const id=await product();assert.equal((await request('/api/carrito',{method:'POST',token:tokenA,body:{id_producto:id,cantidad:2}})).status,200);
 const cart=await request('/api/carrito',{token:tokenA});assert.ok(cart.body.some(p=>p.id_producto===id&&p.cantidad===2));
 assert.equal((await request('/api/usuarios/perfil',{method:'PUT',token:tokenA,body:{nombre:'Nombre ficticio actualizado',telefono:'000',direccion:'Dirección ficticia'}})).status,200);
 const profile=await request('/api/usuarios/perfil',{token:tokenA});assert.equal(profile.body.nombre,'Nombre ficticio actualizado');assert.equal(profile.body.password,undefined);
});
test('regression: order history, status updates, dashboard and analytics remain available',async()=>{
 const id=await product(),created=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});
 assert.equal((await request('/api/pedidos/'+created.body.id_pedido,{method:'PUT',token:tokenAdmin,body:{estado:'preparando'}})).status,200);
 const mine=await request('/api/pedidos/mis-pedidos',{token:tokenA});assert.ok(mine.body.some(p=>p.id_pedido===created.body.id_pedido&&p.estado==='preparando'));
 for(const route of ['/api/pedidos','/api/pedidos/dashboard/admin','/api/analytics/ventas-mensuales','/api/analytics/pedidos-estados','/api/analytics/productos-top','/api/analytics/usuarios-nuevos']){
  assert.equal((await request(route,{token:tokenAdmin})).status,200,route);
  assert.equal((await request(route,{token:tokenA})).status,403,route);
 }
});
test('integrity: all foreign key relationships have no orphan rows',async()=>{
 const [relations]=await pool.query('SELECT TABLE_NAME,COLUMN_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL');
 assert.equal(relations.length,11);for(const f of relations){for(const value of Object.values(f))assert.match(value,/^[a-z_]+$/);
 const [[n]]=await pool.query('SELECT COUNT(*) AS n FROM `'+f.TABLE_NAME+'` c LEFT JOIN `'+f.REFERENCED_TABLE_NAME+'` p ON c.`'+f.COLUMN_NAME+'`=p.`'+f.REFERENCED_COLUMN_NAME+'` WHERE c.`'+f.COLUMN_NAME+'` IS NOT NULL AND p.`'+f.REFERENCED_COLUMN_NAME+'` IS NULL');assert.equal(n.n,0);}
});
test('SMTP failure also permits registration and order-status updates',async()=>{
 const {transporter}=await import('../src/utils/mailer.js');const original=transporter.sendMail;
 transporter.sendMail=async()=>{throw Object.assign(new Error('injected transport failure'),{code:'ECONNREFUSED'});};
 try{
 const registered=await request('/api/auth/register',{method:'POST',body:{nombre:'Prueba sin correo',correo:'no-mail@example.invalid',password:'test-password-no-mail'}});assert.equal(registered.status,201);
 const id=await product(),created=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});assert.equal(created.status,201);
 assert.equal((await request('/api/pedidos/'+created.body.id_pedido,{method:'PUT',token:tokenAdmin,body:{estado:'enviado'}})).status,200);
 const [[p]]=await pool.query('SELECT estado FROM pedidos WHERE id_pedido=?',[created.body.id_pedido]);assert.equal(p.estado,'enviado');
 }finally{transporter.sendMail=original;}
});
test('production startup works without SMTP credentials and without contacting mail service',async()=>{
 const env={...process.env,NODE_ENV:'production',MAIL_ENABLED:'false',PORT:'34072'};delete env.EMAIL_USER;delete env.EMAIL_PASS;
 const child=spawn(process.execPath,['src/server.js'],{cwd:new URL('..',import.meta.url),env,stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',()=>{});
 try{for(let i=0;i<60&&!output.includes('Servidor listo');i++)await new Promise(r=>setTimeout(r,100));assert.match(output,/34072/);assert.equal((await fetch('http://127.0.0.1:34072/health/ready')).status,200);}
 finally{child.kill();await new Promise(r=>child.once('exit',r));}
});

test('MAIL_ENABLED=false permits all notification flows without constructing SMTP',async()=>{
 const {transporter,createMailer}=await import('../src/utils/mailer.js');const original=transporter.sendMail;
 let transports=0;const logs=[];
 const disabled=createMailer({enabled:false,test:false,createTransport:()=>{transports++;throw Error('SMTP forbidden');},logger:s=>logs.push(s)});
 transporter.sendMail=disabled.sendMail;
 try {
  const registered=await request('/api/auth/register',{method:'POST',body:{nombre:'Cliente sin notificación',correo:'disabled-mode@example.invalid',password:'fixture-disabled-pass'}});assert.equal(registered.status,201);
  const id=await product(),created=await request('/api/pedidos',{method:'POST',token:tokenA,body:order(id)});assert.equal(created.status,201);
  assert.equal((await request('/api/pedidos/'+created.body.id_pedido,{method:'PUT',token:tokenAdmin,body:{estado:'preparando'}})).status,200);
  assert.equal(transports,0);assert.equal(logs.length,3);assert.ok(logs.every(l=>l==='Correo omitido por configuración (MAIL_ENABLED=false)'));
 }finally{transporter.sendMail=original;}
});
