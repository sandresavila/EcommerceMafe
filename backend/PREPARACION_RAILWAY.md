> Actualización fase 3.5: MAIL_ENABLED=false ya está implementado y validado; ver SEGURIDAD_PUBLICACION.md para el estado vigente, el repositorio local preparado y la rotación pendiente.

> Actualización fase 3.4: MySQL 8.4.13 ya fue validado con 29 pruebas aprobadas. El repositorio remoto y sus bloqueos están documentados en VALIDACION_FINAL_RAILWAY.md; ese informe prevalece sobre los pendientes históricos de este documento.

# Preparación de despliegue MAFE Beauty — fase 3.3

## Resultado y límites

Trabajo realizado solo en esta copia independiente. La carpeta original no contiene .git. Existe un repositorio padre en C:/Users/santi, rama master, que no versiona backend/package.json del proyecto; no se crearon ramas ni commits en ese repositorio ajeno. No se identificó aún el remoto y revisión de producción.

No se copiaron archivos .env ni node_modules ni .next. No se modificaron MySQL local ecommerce_belleza ni MySQL railway de producción; no se abrieron conexiones a esos servicios durante las pruebas. No se publicaron servicios ni se modificó Vercel.

Se creó y apagó una instancia MySQL 8.0.45 independiente, ligada a 127.0.0.1:33070, con datadir mysql-pruebas-33/data fuera del original. Las pruebas verifican ese datadir antes de crear un esquema de prueba nuevo con datos ficticios. Sus datos se conservaron; no se borraron bases. No hay un servidor de pruebas escuchando al finalizar.

## Cambios y motivos

- src/config/env.js: validación de variables, puertos, secreto JWT de mínimo 32 caracteres, orígenes exactos HTTPS en producción y ubicación estable de uploads.
- src/config/db.js: pool con variables validadas, límite de cola y tiempo de conexión.
- src/app.js y src/server.js: rutas en app para prueba, escucha en 0.0.0.0 y PORT dinámico, /health y /health/ready, CORS configurable, JSON limitado a 256 KB, cabecera nosniff, 404 JSON, errores centrales y apagado del pool.
- src/middlewares/auth.middleware.js: JWT HS256 y consulta de usuario vigente; rechaza inactivos/eliminados y utiliza rol actual de MySQL.
- src/controllers/auth.controller.js: login rechaza usuarios bloqueados y contraseñas no locales; registro valida antes de escribir, mínimo 8 caracteres y máximo 72 bytes bcrypt.
- src/controllers/pedido.controller.js y src/utils/orderValidation.js: acceso a detalle solo de propietario/admin; cantidades enteras positivas, agregación de duplicados y máximo 100 líneas / 10000 unidades por producto; precios de MySQL; cálculo entero en centavos; bloqueo FOR UPDATE en orden estable y actualización condicional de stock; transacción íntegra; errores de conexión dentro de try; liberación antes del correo.
- Envío: COP 12000 para subtotal menor o igual a COP 200000, gratis solo por encima, igual a checkout existente. El total nuevo incluye el envío; no cambia columnas. Los pedidos históricos no se reescriben.
- src/controllers/producto.controller.js y src/middlewares/product.middleware.js: valida precio, stock, nombre, categoría y booleano de distribución; precios numéricos en lecturas de producto; evita eliminar productos vinculados a pedidos mediante bloqueo y conflicto 409, preservando historia sin cambiar claves foráneas.
- src/controllers/carrito.controller.js: rechaza IDs/cantidades no enteras positivas; límite por solicitud. No se añadió ruta para disminuir cantidad.
- src/middlewares/upload.middleware.js: máximo 5 MB y un archivo, límites de campos, MIME + firma JPEG/PNG/WebP, nombre aleatorio y extensión controlada; escritura en UPLOAD_DIR; elimina únicamente el archivo nuevo huérfano si esa solicitud termina con error. La validación de firma no equivale a decodificar una imagen completa ni a análisis antimalware.
- Todos los controladores: se eliminaron mensajes internos del driver y errores crudos de los logs; se conserva información de código de error sin SQL, cuerpos, tokens o direcciones personales.
- src/utils/mailer.js: mantiene Gmail/Nodemailer, elimina verify al importar, límites de espera SMTP de 5 segundos y transporte JSON exclusivamente en NODE_ENV=test. No se implementó proveedor HTTPS.
- package.json, package-lock.json, .node-version: Node 24.x, script npm test y actualizaciones por avisos reales de npm. Multer 2.1.1 a 2.5.0, mysql2 3.20.0 a 3.24.6, Nodemailer 8.0.8 a 10.3.1 (actualización mayor por avisos de seguridad; API usada probada offline), Nodemon 3.1.14 a 3.1.11 fijado, y transitivas corregidas.
- .gitignore raíz/backend, .env.example y uploads/.gitkeep: plantillas sin secretos, exclusión de entornos, dependencias, cargas y dumps.
- test/security.test.js y test/schema.sql: pruebas HTTP con MySQL real aislado y estructura de diez tablas sin datos de producción.

## Verificaciones ejecutadas

Entorno: Node 24.14.1, npm 11.11.0.

1. npm ci sobre bloqueo original: instalación correcta; 10 avisos (1 crítico, 6 altos, 3 moderados).
2. Actualizaciones dirigidas, sin audit fix --force.
3. npm ci final: 130 paquetes instalados, 131 auditados; instalación correcta.
4. npm audit final: 0 vulnerabilidades reportadas (incluido desarrollo). Esto no garantiza ausencia absoluta de vulnerabilidades.
5. node --check: 30 archivos JS, cero errores.
6. Suite final: 22 pruebas ejecutadas, 22 aprobadas, 0 fallidas.
7. Hashes originales: cero cambios en los archivos inventariados; frontend de la copia sin cambios.
8. Arranque del punto de entrada y puerto dinámico comprobados dentro de la suite; /health y /health/ready responden correctamente.
9. Instancia de pruebas apagada ordenadamente tras verificar su datadir.

Incidencias durante desarrollo: la primera instancia temporal iniciada en sandbox no aceptaba conexiones desde el ejecutor; se reinició con acceso de red local autorizado. La primera carga del esquema de prueba necesitó ordenarse según las dependencias de sus claves foráneas. Esas ejecuciones no acreditaron pruebas funcionales; solo la ejecución final de 22 casos se reporta como aprobada.

Cobertura: configuración, login, JWT inválido/expirado/algoritmo incorrecto, bloqueo/eliminación/cambio de rol con tokens previos, propietario de pedido, manipulación de precio, cantidades inválidas, duplicados, concurrencia real de stock, reversión por fallo posterior a escrituras, umbral de envío, precisión monetaria, CORS/preflight, cargas, errores de JSON/BD, disponibilidad, registro, productos con historia y fallo de correo posterior al commit.

No se ejecutaron pruebas de escritura ni arranque con datos reales en Railway 8.4.13. No se enviaron correos reales. No se ejecutó un build del frontend ni se hizo prueba E2E del navegador.

## Railway: próxima configuración, no aplicada

- Root Directory: /backend.
- Node: 24.x; instalar con npm ci --omit=dev.
- Build adicional: ninguno.
- Start: npm start.
- PORT: suministrado por Railway; escucha 0.0.0.0.
- Health check: /health/ready (comprueba SELECT 1 y acceso de lectura/escritura a uploads; no valida correo ni todas las tablas).
- NODE_ENV=production.
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: referencias a MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE del servicio MySQL del mismo entorno. No usar localhost ni el puerto temporal del túnel en producción.
- JWT_SECRET: nuevo secreto aleatorio, mínimo 32 caracteres, exclusivo del backend.
- BACKEND_URL: origen HTTPS público sin /api.
- FRONTEND_URL: origen HTTPS del frontend existente.
- CORS_ORIGINS: lista separada por comas de orígenes exactos autorizados. Si se omite usa FRONTEND_URL. No usar * ni permitir indiscriminadamente previews.
- UPLOAD_DIR=/app/uploads.
- EMAIL_USER y EMAIL_PASS: credenciales de Gmail solo si se elige SMTP con plan compatible.

No se agregaron variables reales ni credenciales. .env.example debe completarse fuera del control de versiones. readEnvironment falla al arrancar si faltan variables esenciales o si las URLs de producción no son HTTPS.

## Persistencia propuesta

Crear en fase posterior un volumen exclusivo del backend montado en /app/uploads, coherente con UPLOAD_DIR. Transferir los 45 archivos inventariados con nombres intactos y comparar tamaños/hashes. El montaje no recupera los archivos automáticamente y puede ocultar los incluidos en la imagen.

Validar una carga y su lectura después de un redespliegue autorizado. Respaldar el volumen separado de MySQL. Iniciar con una réplica, evitando asumir que discos locales se comparten entre réplicas. No se creó volumen ni se transfirieron imágenes en esta fase.

## Correo: propuesta pendiente de autorización

Railway Trial/Free/Hobby bloquea SMTP; la implementación Gmail no garantiza entrega en el plan actual. No se cambió el proveedor ni se contrató ningún plan.

Alternativa propuesta: API HTTPS de Resend (POST https://api.resend.com/emails) usando fetch de Node. Reutilizar las plantillas actuales y la interfaz async sendMail consumida por registro y pedidos. Requeriría autorización separada para implementar un adaptador y para cualquier configuración externa.

Preparación prevista: verificar dominio remitente y DNS del usuario, crear y guardar RESEND_API_KEY solo en Railway y EMAIL_FROM con remitente verificado, mapear from/to/subject/html, timeout y errores sanitizados, probar con un destinatario autorizado. No reutilizar automáticamente una dirección Gmail como remitente verificado. Evaluar idempotencia y reintentos antes de aplicarlos; no incorporados.

Fuentes:
- https://docs.railway.com/networking/outbound-networking
- https://resend.com/docs/api-reference/emails/send-email
- https://github.com/nodemailer/nodemailer/blob/master/CHANGELOG.md

## Pendientes y condiciones de publicación

- Identificar y utilizar el repositorio y revisión correctos para versionar esta copia; no hacer push a un repositorio padre ajeno.
- Aprobar e implementar la solución de correo HTTPS o elegir explícitamente un plan compatible con SMTP.
- Crear backend/volumen y definir secretos solo en una siguiente fase autorizada.
- Verificar integración frontend/Vercel y formato de precios en favoritos/carrito; la disminución del carrito sigue sin persistirse y no se corrigió el frontend en esta fase.
- Revisar revocación de tokens por cambio de contraseña e idempotencia de checkout como mejoras futuras; se invalidan inmediatamente los permisos según el estado/rol actual, no se creó un sistema de sesiones nuevo.
- Verificar la política de cancelaciones/reposición de inventario y eliminación de usuarios antes de operaciones reales; no se cambió esa lógica histórica.
- No se confirma el estado de exposición de secretos en el repositorio remoto; si se compartieron, rotarlos antes de publicar.
- Repetir pruebas de compatibilidad sobre una instancia MySQL 8.4 independiente antes de aceptación final de producción. Las pruebas de esta fase se hicieron en MySQL 8.0.45 aislado.
- Realizar pruebas de concurrencia ampliadas, rate limiting y monitoreo según el tráfico previsto; no fueron añadidos como funcionalidades nuevas.

Estado: preparado y probado en copia independiente para revisión. No publicado; la operación completa en Railway queda condicionada a correo, persistencia, secretos, procedencia Git y validación de integración.

## Siguiente fase

1. Revisar/aceptar los cambios y seleccionar el repositorio correcto.
2. Resolver la propuesta de correo.
3. Autorizar creación del servicio backend y su volumen.
4. Configurar referencias privadas y secretos, dominio y CORS.
5. Publicar API y validar /health/ready, autenticación, permisos y persistencia.
6. Actualizar Vercel únicamente con autorización posterior y ejecutar aceptación E2E.
