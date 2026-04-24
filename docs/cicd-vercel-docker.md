# CI/CD propuesto (GitHub + Vercel + Docker)

## Respuesta corta sobre Vercel + Docker
Vercel no ejecuta `docker-compose` ni contenedores backend persistentes como NestJS + PostgreSQL.

## Estrategia recomendada para este proyecto
1. Frontend React/Vite: desplegar en Vercel.
2. Backend NestJS: empaquetar Docker y desplegar en un host de contenedores (Render, Railway, Fly.io, Azure Container Apps, ECS, etc.).
3. Base de datos PostgreSQL: servicio gestionado o contenedor dedicado fuera de Vercel.

## Workflows incluidos
1. `.github/workflows/ci.yml`
   - Frontend: lint + build.
   - Backend: tests unitarios, e2e y build.
2. `.github/workflows/cd-frontend-vercel.yml`
   - Despliegue automatico a Vercel en `main`.
3. `.github/workflows/cd-backend-docker.yml`
   - Construccion y push de imagen backend a GHCR en `main`.

## Secrets requeridos en GitHub
1. Para Vercel:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
2. Para runtime backend (si tu plataforma no usa secretos externos):
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `MAIL_ENABLED`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Flujo de release
1. Push a `main`.
2. Corre CI de frontend y backend.
3. Si CI pasa:
   - Frontend se publica en Vercel.
   - Backend publica imagen Docker en GHCR.
4. El despliegue del backend en tu proveedor Docker consume la imagen nueva y reinicia servicio.

## Nota operativa
Si quieres que backend y frontend salgan en una sola URL publica, usa un reverse proxy en el proveedor del backend o una configuracion de dominio que enrute frontend y API por separado.