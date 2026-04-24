# Proyecto IA Frontend

Frontend React + TypeScript + Vite para la plataforma de gestion de tickets del proyecto.

## Estado actual
1. Autenticacion conectada al backend NestJS.
2. Dashboards por rol conectados a API real.
3. Persistencia local limitada a la sesion autenticada.

## Requisitos
1. Node.js 20+
2. Backend NestJS corriendo en `http://localhost:3001`

## Variables de entorno
1. Desarrollo local: `VITE_API_BASE_URL=http://localhost:3001/api/v1`
2. Produccion con mismo dominio: omitir `VITE_API_BASE_URL` y publicar el frontend con el `Dockerfile` de este repositorio para que Nginx haga proxy de `/api` al backend.
3. Produccion con dominio separado: `VITE_API_BASE_URL=https://<tu-backend>.up.railway.app/api/v1`

## Comandos
1. `npm install`
2. `npm run build`
3. `npm run dev`
4. `npm run preview`

## Despliegue Railway con un solo dominio
1. Crear un servicio frontend en Railway apuntando a la raiz del repositorio.
2. Railway usara `Dockerfile` y `railway.json` de la raiz.
3. Configurar `BACKEND_ORIGIN=https://<tu-backend>.up.railway.app` en el servicio frontend.
4. Mantener `CORS_ORIGIN=https://proyectoia-production-e74c.up.railway.app` en el backend.
5. Con esta configuracion el navegador usa `/api/v1` sobre el mismo dominio publico y Nginx reenvia al backend.

## Flujos integrados
1. Login y registro real.
2. Registro publico de clientes redirigido al alta real.
3. Dashboard Cliente con tickets reales.
4. Dashboard Tecnico con toma y avance de tickets.
5. Dashboard Administrativo con asignacion y cierre.
6. Dashboard Admin plataforma con usuarios, catalogos, parametros y auditoria.

## Documentacion relacionada
1. `docs/etapa-8-integracion-frontend.md`
2. `docs/checklist-predespliegue.md`
3. `docs/roadmap-backend-proyectoIA.md`
4. `proyectoIAbkacend/docs/guia-despliegue.md`
