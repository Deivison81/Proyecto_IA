# Guia de despliegue backend

## Alcance
Guia operativa para preparar el backend NestJS del proyecto sin ejecutar un despliegue productivo real desde esta etapa.

## Requisitos
1. Docker Desktop o Docker Engine con Compose.
2. Archivo `.env` basado en `.env.example`.
3. Puertos disponibles: `3000`, `5433`, `5050`.
4. Para Railway: proyecto y servicio creados en `https://railway.com`.

## Opcion A - Ejecucion local para desarrollo
1. `Copy-Item .env.example .env`
2. `docker compose up -d postgres pgadmin`
3. `npm install`
4. `npm run migration:run`
5. `npm run start:dev`
6. Verificar:
   - Swagger: `http://localhost:3000/api/docs`
   - Health: `http://localhost:3000/api/v1/health`

## Opcion B - Ejecucion containerizada
1. `Copy-Item .env.example .env`
2. Ajustar secretos reales antes de salir de entorno demo.
3. `docker compose up -d --build`
4. Verificar servicios:
   - API: `http://localhost:3000/api`
   - Swagger: `http://localhost:3000/api/docs`
   - Health: `http://localhost:3000/api/v1/health`
   - pgAdmin: `http://localhost:5050`

## Opcion C - Despliegue en Railway
1. Crear servicio en Railway conectado a este repositorio.
2. Configurar `Root Directory` del servicio en `proyectoIAbkacend`.
3. Railway detecta `railway.json` y construye con `Dockerfile`.
4. Definir variables de entorno minimas en Railway:
   - `NODE_ENV=production`
   - `PORT` (la define Railway automaticamente)
   - Opcion A (recomendada): `DATABASE_URL` (entregada por Railway Postgres)
   - Opcion B: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `MAIL_ENABLED`, `MAIL_FROM`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (solo si `MAIL_ENABLED=true`)
   - `CORS_ORIGIN` con el dominio del frontend (por ejemplo Vercel)
5. Activar Postgres gestionado en Railway o usar DB externa.
6. Validar post-deploy:
   - `https://<tu-servicio>.up.railway.app/api/v1/health`
   - `https://<tu-servicio>.up.railway.app/api/docs`

## Troubleshooting rapido (Failed to fetch)
1. En Vercel (frontend), definir `VITE_API_BASE_URL=https://<tu-servicio>.up.railway.app/api/v1`.
2. En Railway (backend), definir `CORS_ORIGIN=https://<tu-frontend>.vercel.app`.
3. Confirmar que `https://<tu-servicio>.up.railway.app/api/v1/health` responde `200`.
4. Si usas Postgres de Railway, priorizar `DATABASE_URL` para evitar errores de conexion.

## Flujo del contenedor backend
1. Construye la app NestJS con `npm run build` dentro de la imagen.
2. Al iniciar, ejecuta `npm run migration:run:prod` contra PostgreSQL.
3. Luego publica la API en el puerto `3000`.
4. El healthcheck consulta `/api/v1/health` para confirmar disponibilidad.

## Checklist minimo antes de un deploy real
1. Ejecutar `npm run build`.
2. Ejecutar `npm test`.
3. Ejecutar `npm run test:e2e`.
4. Revisar `npm audit` y dejar decision documentada.
5. Reemplazar secretos demo (`JWT_SECRET`, SMTP, credenciales DB).
6. Confirmar acceso a Swagger solo en entornos internos o deshabilitarlo en produccion si la politica lo exige.

## Riesgos conocidos
1. `npm audit` sigue reportando 2 vulnerabilidades moderadas via `typeorm -> uuid`.
2. El compose actual esta orientado a entorno local o QA; faltan endurecimientos productivos como secretos gestionados, reverse proxy y observabilidad externa.