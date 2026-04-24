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
2. Produccion recomendada (Vercel + Railway): `VITE_API_BASE_URL=https://<tu-backend>.up.railway.app/api/v1`
3. Opcional (mismo dominio): omitir `VITE_API_BASE_URL` y publicar el frontend con el `Dockerfile` de este repositorio para que Nginx haga proxy de `/api` al backend.

## Comandos
1. `npm install`
2. `npm run build`
3. `npm run dev`
4. `npm run preview`

## Despliegue recomendado (Backend Railway + Frontend Vercel)
1. Backend en Railway usando `proyectoIAbkacend` como `Root Directory`.
2. Frontend en Vercel usando la raiz del repositorio.
3. En Vercel, definir `VITE_API_BASE_URL=https://<tu-backend>.up.railway.app/api/v1`.
4. En Railway backend, definir `CORS_ORIGIN=https://<tu-frontend>.vercel.app`.
5. Verificar `https://<tu-backend>.up.railway.app/api/v1/health` y luego login/registro desde Vercel.

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
