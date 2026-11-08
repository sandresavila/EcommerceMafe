> Actualización fase 3.5: MAIL_ENABLED=false ya está implementado y validado; ver SEGURIDAD_PUBLICACION.md para el estado vigente, el repositorio local preparado y la rotación pendiente.

# Fase 3.4 — Validación final del backend MAFE Beauty

## 1. Resultado verificado

Backend validado en copia independiente con Node.js 24.14.1, npm 11.11.0 y MySQL 8.4.13 real, aislado del servidor local existente y de Railway. Se ejecutaron 29 pruebas: 29 aprobadas, 0 fallidas. Incluyen los 22 casos anteriores y 7 casos adicionales de regresión, integridad y correo. No se enviaron correos reales.

Instalación limpia completa: npm ci, correcta. Instalación exacta de producción: npm ci --omit=dev, correcta (104 paquetes instalados, 105 auditados). Tras omitir desarrollo se ejecutó una prueba adicional de arranque productivo sin credenciales SMTP: 1 aprobada. Las auditorías completa y de producción reportaron 0 vulnerabilidades a la fecha de esta ejecución, sin representar una garantía absoluta de seguridad.

La instancia temporal se descargó del sitio oficial de MySQL en formato ZIP 8.4.13; se comparó el MD5 publicado 7b94489d5524dea9b27097068bea25a8 antes de extraer. No se instaló un servicio Windows. Se inicializó un datadir nuevo mysql-pruebas-84/data, se escuchó solo en 127.0.0.1:33084 y se apagó ordenadamente al finalizar. El harness comprueba puerto permitido, datadir y versión antes de escribir. Usa esquemas nuevos, cuentas y datos ficticios. No se abrieron conexiones ni se hicieron escrituras en ecommerce_belleza o railway durante esta fase.

Fuentes: https://dev.mysql.com/downloads/mysql/8.4.html y https://dev.mysql.com/doc/refman/8.4/en/upgrade-paths.html.

## 2. Cobertura y compatibilidad

- Autenticación: login/registro, JWT inválidos/expirados y algoritmo incorrecto.
- Autorización: estado activo y rol vigente en BD, usuarios eliminados, acceso de propietario/admin a pedidos y rechazo a terceros.
- Catálogo: lectura y detalle, precios numéricos, alta/actualización de productos y categorías.
- Persistencia de favoritos, carrito y perfil; aislamiento por usuario.
- Pedidos: importes confiables desde MySQL, envío coherente con frontend, precisión en centavos, cantidades inválidas, duplicados y límites.
- Transacciones: falla después de escrituras revierte stock/pedido/detalles.
- Concurrencia real: dos compras de la última unidad producen una aceptación y un conflicto, sin stock negativo.
- Historial: bloqueo de eliminación de productos referenciados por pedidos.
- Dashboard, pedidos propios, cambio de estados y cuatro endpoints analytics.
- Integridad: once relaciones, sin registros huérfanos en los datos ficticios.
- CORS, preflight, carga de imágenes, límites, firmas y respuestas de error sanitizadas.
- Disponibilidad y arranque con puerto dinámico; arranque en NODE_ENV=production.
- Fallos SMTP simulados: no revierten registro, pedido confirmado ni cambio de estado.

mysql2 3.24.6 funcionó con MySQL 8.4.13 en estas pruebas. No se detectaron regresiones en los flujos probados. No se realizó una prueba E2E del navegador ni un despliegue Linux/Railway; esas verificaciones siguen pendientes.

En esta fase solo se amplió el harness y la documentación; no se cambió la lógica productiva de la fase 3.3. El harness permite exclusivamente los puertos aislados 33070/33084 y confirma el datadir correspondiente. Para la validación 8.4 se usó MAFE_TEST_MYSQL_PORT=33084.

## 3. Repositorio identificado

Referencia pública localizada en el README y comprobada mediante GitHub API:
- Repositorio: https://github.com/sandresavila/EcommerceMafe
- Rama predeterminada: main.
- Revisión examinada: 9c09831528fa6994d5ee6470ea55a0649a2b35b5.
- Fecha de revisión remota: 2026-06-01T18:46:34Z.
- Los 27 archivos backend comparables (manifiestos, configuración, rutas, controladores y utilidades) coinciden byte por byte con el backend original local mediante hash Git de blob.
- El remoto tiene tres modelos adicionales vacíos: pedido.model.js, producto.model.js y usuario.model.js. No están importados por el código inspeccionado y deben conservarse al integrar.
- El ZIP local carece de historial Git; la coincidencia de estos archivos no prueba la procedencia de todos los archivos del ZIP.
- El repositorio padre C:/Users/santi en master no versiona este proyecto. No debe utilizarse para incorporar estos cambios.
- No se inicializó Git, clonó repositorio, creó rama, hizo commit, push o PR.

Hallazgo importante: backend/.env está versionado en el repositorio público. Se comprobó solo su ruta, sin descargar o mostrar su contenido. Antes de publicar, revisar y revocar/rotar cualquier secreto vigente que hubiera contenido. Retirar el archivo del seguimiento y añadir ignore no elimina su historial; cualquier limpieza histórica requiere una aprobación separada. No se afirma que las credenciales nuevas de Railway estén expuestas.

## 4. Diferencias y lista de incorporación

Hay 18 archivos existentes modificados y 13 nuevos propuestos (incluida esta documentación). El listado exacto está en archivos-incorporacion-fase34.txt y el manifiesto con base de comparación en incorporacion-github-fase34.json, fuera del original.

Cambios funcionales deliberados ya aplicados en fase 3.3:
- usuarios bloqueados o con rol modificado dejan de conservar permisos de tokens anteriores;
- un cliente no consulta pedidos de otra persona;
- el servidor ignora el precio remitido por el cliente;
- los pedidos nuevos incluyen el envío; los históricos no se reescriben;
- productos con pedidos no pueden eliminarse;
- registro exige al menos 8 caracteres y no supera 72 bytes para bcrypt;
- imágenes de máximo 5 MB, extensiones y firmas controladas;
- CORS exacto, variables validadas, health y errores controlados.

Ningún archivo del frontend ni archivo inventariado del proyecto original fue modificado. Los logs de pruebas, auditorías, archivos personales .env, backups, binarios MySQL, datadirs y node_modules no forman parte de la lista de incorporación. Los 45 archivos de uploads tampoco se incluyen como cambios de código; deben transferirse al volumen en la fase correspondiente.

## 5. Estrategia Git propuesta, no ejecutada

1. Resolver primero la exposición de secretos, coordinando revocación con el propietario.
2. Con autorización, obtener un checkout independiente del repositorio existente, sin inicializar el directorio personal ni crear otro remoto.
3. Revalidar main contra la revisión examinada. Si avanzó, comparar otra vez; no sobrescribir cambios nuevos.
4. Crear codex/railway-backend-hardening desde la base confirmada.
5. Copiar únicamente los 31 archivos de la lista. No reemplazar backend completo y conservar los modelos/archivos remotos adicionales.
6. Retirar backend/.env del índice con autorización; usar .env.example y variables de plataforma. No incorporar ningún valor del archivo.
7. Revisar diff y staged por lista explícita (no git add .), y ejecutar nuevamente pruebas y audit.
8. Solo después de autorización: commits acotados, push de la rama y PR hacia main. No fusionar automáticamente.
9. Desplegar exclusivamente una revisión revisada y aprobada; registrar su SHA. El código corregido todavía no está en GitHub.

## 6. Correo y demostración académica

El código productivo conserva Gmail/Nodemailer. No hay verify ni conexión SMTP al importar el módulo: el servidor puede arrancar sin credenciales. Las operaciones con correo son registro, creación de pedido y actualización de estado. Capturan la falla de envío; registro/pedido/estado pueden persistir aunque el correo falle. Las consultas de catálogo, perfil, carrito, favoritos y administración no necesitan envío.

Diferenciar:
- NODE_ENV=test usa transporte JSON, sin red: exclusivo de pruebas.
- En producción con Gmail fallando, se intenta el envío y puede existir demora antes del error. Los timeouts de conexión, saludo y socket son de 5 s por etapa; no equivalen a un único plazo total garantizado.
- No hay deshabilitación explícita por configuración. MAIL_ENABLED=false o MAIL_MODE=disabled hoy no cambian el comportamiento porque el código no los consume.
- /health/ready verifica MySQL y acceso a uploads; no acredita entrega de correo.

Railway bloquea SMTP en Free/Trial/Hobby. Fuente: https://docs.railway.com/networking/outbound-networking.

Recomendación para demostración: aprobar primero un parche mínimo con MAIL_ENABLED=false, manteniendo NODE_ENV=production. Debe omitir totalmente la conexión SMTP, registrar solo que el envío está deshabilitado y no afirmar entrega. Documentar la limitación en las evidencias y probar las tres operaciones. No habilitar NODE_ENV=test en producción ni configurar credenciales ficticias para simular un apagado.

El parche y la variable son una propuesta: no se implementaron ni configuraron. Alternativa definitiva: adaptador HTTPS de correo, ya propuesto, con dominio remitente verificado y credencial nueva; requiere autorización separada. No se contrató plan ni cambió proveedor.

## 7. Configuración exacta propuesta para Railway

Proyecto glistening-acceptance; entorno production; servicio futuro mafe-backend, todavía inexistente.

| Parámetro | Configuración prevista |
|---|---|
| Repositorio | sandresavila/EcommerceMafe |
| Rama inicial propuesta | codex/railway-backend-hardening, después de revisión y autorización |
| Base remota examinada | main @ 9c09831528fa6994d5ee6470ea55a0649a2b35b5 |
| Root Directory | /backend |
| Builder | Railpack |
| Node.js | 24.x, engines y .node-version; RAILPACK_NODE_VERSION=24 si se necesita fijar explícitamente |
| Instalación | npm ci --omit=dev |
| Override instalación | RAILPACK_INSTALL_CMD=npm ci --omit=dev |
| Build adicional | Ninguno; no ejecutar pruebas contra producción en build |
| Start Command | npm start |
| Health check | /health/ready |
| Puerto | PORT proporcionado por Railway; el código escucha 0.0.0.0 |
| Réplicas iniciales | 1 |
| Volumen backend | /app/uploads |
| Dominio | HTTPS generado para el nuevo backend, aún no existe |

Railway documenta RAILPACK_INSTALL_CMD en https://docs.railway.com/builds/build-configuration. Node en https://railpack.com/languages/node/.

Variables, sin valores secretos:
- NODE_ENV=production.
- DB_HOST=${{MySQL.MYSQLHOST}}
- DB_PORT=${{MySQL.MYSQLPORT}}
- DB_USER=${{MySQL.MYSQLUSER}}
- DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
- DB_NAME=${{MySQL.MYSQLDATABASE}} (debe resolver a railway).
- JWT_SECRET: aleatorio nuevo, mínimo 32 caracteres, exclusivo.
- BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}, una vez asignado el dominio; sin /api.
- FRONTEND_URL: origen HTTPS real del proyecto Vercel; el README referencia https://ecommerce-mafe.vercel.app, pendiente de reconfirmar antes de configurar.
- CORS_ORIGINS: ese origen exacto o lista explícita aprobada. Puede referenciar FRONTEND_URL. No usar comodines.
- UPLOAD_DIR=/app/uploads.
- EMAIL_USER/EMAIL_PASS solo si se decide conservar SMTP en un plan compatible.
- MAIL_ENABLED=false únicamente después de aprobar e implementar el parche propuesto; no es una variable efectiva actualmente.

Los servicios API/MySQL deben compartir proyecto y entorno para usar red privada. Nunca usar localhost/33084 o el túnel local como conexión del backend en Railway. La sintaxis de referencias está documentada en https://docs.railway.com/variables/reference.

La configuración requiere FRONTEND_URL y BACKEND_URL HTTPS antes del arranque válido. Generar/verificar dominio y variables antes de habilitar tráfico; no eludir la validación con URLs ficticias.

## 8. Volumen e imágenes

Planear volumen exclusivo del backend y montaje /app/uploads. El código usa ese directorio mediante UPLOAD_DIR y la misma ruta para cargas y estáticos. Transferir después los 45 archivos inventariados con nombres intactos; comprobar tamaños/hashes y lectura de una carga tras redespliegue. No asumir que los archivos incluidos en la imagen aparecerán bajo un volumen vacío. Respaldar imágenes y MySQL por separado.

No se creó ni modificó un volumen, ni se copiaron imágenes a Railway en esta fase.

## 9. Bloqueos y publicación futura

Bloqueos antes de publicación pública:
1. Revisar/rotar secretos del .env público y autorizar su retirada del seguimiento.
2. Aceptar e incorporar los cambios al repositorio correcto; no se han subido.
3. Aprobar el modo explícito sin correo para demostración o una solución de entrega compatible.
4. Autorizar servicio backend, secretos, volumen, dominio y despliegue.
5. Validar integración del navegador y comportamiento en Linux/Railway.

Secuencia concreta posterior:
1. Resolver secretos y correo; aceptar diff/lista.
2. Crear rama, ejecutar validaciones y autorizar commit/push/PR.
3. Tras aprobar la revisión a desplegar, crear backend en el proyecto existente, configurar raíz, instalación, start, referencias y volumen.
4. Asignar dominio HTTPS, BACKEND_URL y CORS; desplegar una revisión registrada.
5. Comprobar /health/ready, acceso anónimo/protegido, registros/logs sanitizados y persistencia de imágenes.
6. No crear pedidos de prueba en railway sin autorización específica: usar entorno de aceptación separado o casos expresamente acordados.
7. Solo con autorización posterior, conectar Vercel y ejecutar aceptación E2E.
8. Conservar evidencia de revisión, variables por nombre, build, disponibilidad, pruebas y limitaciones del correo.

Estado final: compatibilidad técnica local con MySQL 8.4.13 validada; publicación todavía condicionada a los bloqueos indicados. Sin commits, push, PR, nuevos servicios, cambios de Vercel ni modificaciones de producción.
