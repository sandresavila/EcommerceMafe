# Fase 3.5 — Seguridad y preparación local de publicación de MAFE Beauty

## Estado y alcance

Repositorio obtenido: https://github.com/sandresavila/EcommerceMafe.git.
Rama local: codex/railway-backend-hardening.
Base, HEAD y main local permanecen en 9c09831528fa6994d5ee6470ea55a0649a2b35b5.
No se realizaron commits, push, PR, cambios en main ni reescrituras de historial.

El checkout independiente está en EcommerceMafe-publicacion, fuera del original y de mafe-preparacion. Se obtuvo mediante clone parcial --filter=blob:none --no-checkout y checkout selectivo, excluyendo el .env, dependencias y datos/activos remotos no necesarios. Se conservaron en el índice los archivos remotos adicionales no modificados, incluidos los tres modelos vacíos y todo el frontend.

No se materializó backend/.env en el árbol de trabajo ni se copió a nuevos archivos de configuración o informes. El historial Git aún referencia y puede contener el blob público: esta copia NO es un historial saneado. Se revisó el ACL de .git y no se detectaron permisos para grupos amplios Everyone/Authenticated Users/Users; no equivale a cifrado. El archivo .env que ya existía en la carpeta original permanece intacto y no se duplicó.

## Variables expuestas y plan de rotación

Se inspeccionó el .env público solo en memoria, sin mostrar ni guardar valores. Nombres encontrados:
PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, EMAIL_USER, EMAIL_PASS, JWT_SECRET.

| Tipo | Variable | Acción pendiente en proveedor |
|---|---|---|
| Acceso a MySQL | DB_PASSWORD, asociada a DB_USER/DB_HOST | Identificar el servidor/cuenta afectados y cambiar la contraseña o sustituir la cuenta; revisar privilegios y reutilización. No se modificó MySQL local ni Railway. |
| Gmail/SMTP | EMAIL_PASS, asociada a EMAIL_USER | Revocar la credencial expuesta, verificar si era contraseña de aplicación y generar una nueva solo si se decide conservar SMTP. Revisar actividad de la cuenta. |
| Firma JWT | JWT_SECRET | Sustituir por secreto aleatorio nuevo en el despliegue; invalidar los tokens antiguos. No escribirlo en código ni .env versionados. |
| Metadatos | PORT, DB_HOST, DB_USER, DB_NAME, EMAIL_USER | Revisar exposición/reutilización; los nombres/identificadores no sustituyen los secretos de acceso. |

No se afirma que las nuevas credenciales generadas para Railway estén expuestas. No se rotó ninguna credencial porque eso requiere acciones del propietario en proveedores o cambios de configuración externos, fuera de esta autorización.

También se detectaron 1497 archivos de backend/node_modules rastreados: su retirada del índice local está preparada. db/ecommerce_belleza.db es estructura SQL y seeds de ejemplo, no un dump de usuarios/pedidos; contiene instrucciones de contraseña en texto claro y DROP DATABASE. No se ejecutó, materializó en el checkout ni modificó. Sus instrucciones académicas requieren revisión aparte; no se consideran una credencial segura para reutilizar.

La revisión actual no sustituye un escaneo de todo el historial. En la lista autorizada no se detectaron patrones de alta confianza de claves privadas/PAT. Hubo coincidencias textuales de una contraseña pública de baja entropía con literales de dominio/roles existentes; no corresponden a asignaciones nuevas de credenciales y no se cambiaron roles para ocultar esas coincidencias.

## Retirada actual frente a saneamiento histórico

Preparado localmente con git rm --cached --sparse: backend/.env y backend/node_modules. No se borraron archivos de origen ni se copió el .env. Los cambios siguen pendientes de commit y aprobación para push; el archivo continúa en main y en GitHub.

Los .gitignore excluyen .env y variantes, dependencias, logs, temporales, respaldos SQL/DB, archivos comprimidos y claves/certificados habituales. Se exceptúan únicamente .env.example y backend/test/schema.sql. Se verificó git check-ignore para estas rutas y para una imagen privada hipotética. Los archivos ya rastreados no desaparecen solo por añadir ignores; por eso se preparó la retirada del índice del .env y dependencias.

Procedimiento histórico propuesto, NO ejecutado:
1. Revocar/rotar los secretos primero y revisar su uso en otros servicios.
2. Con el propietario, revisar ramas, tags, forks, PR, Actions/artifacts y nombres anteriores de los archivos. Usar escáner con redacción, sin registrar valores reales.
3. Decidir si la rotación y retirada del archivo son suficientes o si se necesita una limpieza histórica.
4. Si se autoriza por separado, preparar un clon dedicado y ejecutar git-filter-repo --sensitive-data-removal con los paths afectados, verificando los resultados y cambios de SHA.
5. Coordinar colaboradores y protecciones de ramas; no mezclar commits antiguos que reintroduzcan información.
6. Cualquier publicación de historia reescrita o push forzado exige autorización específica. Considerar referencias de PR/caché y GitHub Support según el caso.
7. Revisar clones/forks y habilitar protecciones de secretos cuando se autorice. No se eliminaron ni reescribieron objetos históricos en esta fase.

Fuente: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

## MAIL_ENABLED

- Valores admitidos: true y false exactos, en minúsculas; otros valores fallan al cargar configuración.
- Si se omite: true para conservar el comportamiento previo. Para la demostración se debe establecer explícitamente false.
- false: no se construye transporte Nodemailer ni se intenta SMTP. sendMail devuelve skipped=true, reason=disabled y accepted vacío, sin messageId de entrega.
- Log único por omisión: Correo omitido por configuración (MAIL_ENABLED=false). No incluye destinatarios, asunto, HTML, tokens o credenciales.
- true: conserva Gmail, auth por entorno y los timeouts existentes; las fallas se propagan al manejo ya existente de los controladores.
- NODE_ENV=test con correo habilitado utiliza transporte JSON exclusivamente para pruebas, sin red.
- El ejemplo de configuración incluye NODE_ENV=production y MAIL_ENABLED=false; no contiene credenciales reales.
- Registro, pedido y cambio de estado funcionan con el modo deshabilitado y no afirman que se haya entregado correo. No se modificaron controladores ni plantillas para este modo.
- No se integró Resend ni se cambió de proveedor.

## Integración local y diferencias respecto a main

Se copió exclusivamente el manifiesto de fase 3.4 y se añadió test/mail.test.js. Este informe se añade como documentación de fase 3.5. Se actualizaron las notas de documentos anteriores para indicar que las propuestas de correo deshabilitado ya están implementadas.

Cambios de producción propios de esta fase: src/config/env.js y src/utils/mailer.js, más .env.example e ignores. El resto del endurecimiento procede de la fase 3.3. Las pruebas de integración fueron ampliadas para comprobar las tres notificaciones en modo false.

No se sustituyeron carpetas completas. Los modelos remotos adicionales permanecen intactos. No se incorporaron imágenes, backups, binarios MySQL, logs de ejecución, node_modules ni archivos .env. Los resultados TAP y auditorías se guardaron fuera del checkout Git.

El listado exacto y los hashes están en el manifiesto de integración externo. La diferencia contra main incluye la retirada de 1497 dependencias y el .env, lo que explica el gran número de entradas D en el índice.

## Pruebas ejecutadas

Entorno: Node 24.14.1, npm 11.11.0 y MySQL 8.4.13 independiente en 127.0.0.1:33084, datadir mysql-pruebas-84/data. El harness confirma puerto/datadir/versión antes de escribir y crea esquemas nuevos con datos ficticios.

- npm ci: instalación limpia correcta.
- npm audit completo: 0 vulnerabilidades reportadas.
- Sintaxis: 34 archivos JS sin errores, incluidos los modelos vacíos conservados.
- Suite de integración/seguridad: 30 casos aprobados.
- Mailer: inicialmente 6 casos dentro de la suite conjunta de 36; se añadió un caso para el sender exportado y la suite final de correo ejecutó 7 casos, todos aprobados.
- Cobertura final única: 30 integración/seguridad + 7 correo = 37 casos aprobados, sin fallos. No se presenta como una única ejecución conjunta de 37.
- npm ci --omit=dev: instalación productiva correcta.
- Arranque productivo sin dependencias de desarrollo, NODE_ENV=production y MAIL_ENABLED=false: 1 caso adicional aprobado, /health/ready=200.
- npm audit --omit=dev: 0 vulnerabilidades reportadas.
- MySQL de pruebas apagado ordenadamente al finalizar; ninguna conexión a bases originales o Railway Production.
- Ningún correo real enviado. true se prueba por delegación simulada y composición JSON; false se prueba sin construcción de transporte, por el sender configurado y en los tres flujos HTTP.
- Persisten las pruebas de stock concurrente, atomicidad, datos/relaciones, CORS, archivos y errores.

## Configuración preparada para Railway (no aplicada)

- NODE_ENV=production.
- MAIL_ENABLED=false para la demostración académica.
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME mediante referencias privadas al servicio MySQL del mismo proyecto/entorno.
- JWT_SECRET nuevo y exclusivo, mínimo 32 caracteres.
- BACKEND_URL: origen HTTPS público del futuro backend, sin /api.
- FRONTEND_URL: origen HTTPS real de Vercel.
- CORS_ORIGINS: ese origen exacto o lista explícita aprobada.
- UPLOAD_DIR=/app/uploads, con volumen persistente montado en ese directorio.
- PORT suministrado por Railway; escucha 0.0.0.0.
- Node 24.x; npm ci --omit=dev; npm start; Root Directory /backend.
- Health check /health/ready: valida MySQL y directorio, no entrega de correo.

Con MAIL_ENABLED=false no se requieren EMAIL_USER/EMAIL_PASS para operar la demostración. No se deben introducir credenciales ficticias para forzar fallos. Si se decide habilitar correo real, revisar proveedor/plan y autorizar pruebas de entrega por separado.

## Pendientes antes de commit y push

1. El propietario debe revisar y rotar credenciales potencialmente vigentes y confirmar el resultado; no se ha realizado.
2. Revisar los cambios staged, incluida la retirada del .env/dependencias, y confirmar que la documentación académica no requiere ajustes.
3. Decidir si se sanea el historial; no suponer que la retirada actual lo limpia.
4. Autorizar expresamente commit y después push/PR. No se ejecutaron.
5. Confirmar cuenta/permisos GitHub de escritura en la fase correspondiente; la lectura pública y el clon no prueban permisos de push.
6. Solo posteriormente autorizar servicio backend, secretos, dominio y volumen de Railway, transferencia de imágenes y publicación.
7. Vercel y sus variables siguen sin cambios.

Estado final: rama local revisable y validada, modo académico de correo implementado; seguridad de credenciales pendiente de rotación externa y ningún cambio publicado.
