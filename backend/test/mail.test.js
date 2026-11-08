import {test} from 'node:test';
import assert from 'node:assert/strict';
Object.assign(process.env,{NODE_ENV:'test',DB_HOST:'127.0.0.1',DB_PORT:'33084',DB_USER:'unused_fixture',DB_PASSWORD:'unused_fixture',DB_NAME:'unused_fixture',JWT_SECRET:'test-only-configuration-secret-123456789',FRONTEND_URL:'https://frontend.example',BACKEND_URL:'https://backend.example',MAIL_ENABLED:'false'});
const {createMailer}=await import('../src/utils/mailer.js');
const {readEnvironment}=await import('../src/config/env.js');
test('MAIL_ENABLED validates exact true/false, preserving the enabled default',()=>{
 assert.equal(readEnvironment({...process.env,MAIL_ENABLED:'false'}).mailEnabled,false);
 assert.equal(readEnvironment({...process.env,MAIL_ENABLED:'true'}).mailEnabled,true);
 const env={...process.env};delete env.MAIL_ENABLED;assert.equal(readEnvironment(env).mailEnabled,true);
 for(const value of ['','FALSE','0','yes',' true '])assert.throws(()=>readEnvironment({...process.env,MAIL_ENABLED:value}),/MAIL_ENABLED/);
});
test('disabled mail creates no SMTP transport and logs no recipient or message',async()=>{
 let constructed=0;const logs=[];
 const mail=createMailer({enabled:false,test:false,createTransport:()=>{constructed++;throw Error('SMTP must never be created');},logger:s=>logs.push(s)});
 const result=await mail.sendMail({to:'private@example.invalid',subject:'private subject',html:'private body'});
 assert.equal(constructed,0);assert.equal(result.skipped,true);assert.equal(result.reason,'disabled');assert.deepEqual(result.accepted,[]);assert.equal(result.messageId,undefined);
 assert.deepEqual(logs,['Correo omitido por configuración (MAIL_ENABLED=false)']);
});
test('disabled mail also supports callback without claiming delivery',async()=>{
 const mail=createMailer({enabled:false,logger:()=>{}});
 await new Promise((resolve,reject)=>mail.sendMail({},(error,result)=>{try{assert.equal(error,null);assert.equal(result.skipped,true);resolve();}catch(e){reject(e);}}));
});
test('enabled mail preserves Gmail options and delegates sendMail',async()=>{
 let options,sent=0;
 const mail=createMailer({enabled:true,test:false,createTransport:opts=>{options=opts;return{sendMail:async message=>{sent++;assert.equal(message.subject,'Fixture');return{messageId:'fixture-id'};}};}});
 const result=await mail.sendMail({subject:'Fixture'});assert.equal(sent,1);assert.equal(options.service,'gmail');assert.equal(options.connectionTimeout,5000);assert.equal(result.messageId,'fixture-id');
});
test('enabled JSON test transport composes a message without network delivery',async()=>{
 const mail=createMailer({enabled:true,test:true});
 const info=await mail.sendMail({from:'fixture@example.invalid',to:'receiver@example.invalid',subject:'Fixture',text:'No network'});
 assert.equal(JSON.parse(info.message).subject,'Fixture');
});
test('enabled transport failures propagate to existing callers',async()=>{
 const mail=createMailer({enabled:true,createTransport:()=>({sendMail:async()=>{throw Object.assign(new Error('Fixture error'),{code:'ETIMEDOUT'});}})});
 await assert.rejects(mail.sendMail({}),{code:'ETIMEDOUT'});
});

test('configured MAIL_ENABLED=false exports a sender that skips delivery',async()=>{
 const {transporter}=await import('../src/utils/mailer.js');const original=console.info;const logs=[];console.info=message=>logs.push(message);
 try {
  const result=await transporter.sendMail({to:'fixture@example.invalid',subject:'Must not send',text:'Fixture only'});
  assert.equal(result.skipped,true);assert.deepEqual(result.accepted,[]);assert.equal(result.messageId,undefined);
  assert.deepEqual(logs,['Correo omitido por configuración (MAIL_ENABLED=false)']);
 }finally{console.info=original;}
});
