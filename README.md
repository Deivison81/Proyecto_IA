# Proyecto IA Frontend

Frontend React + TypeScript + Vite para la plataforma de gestion de tickets del proyecto.

## Estado actual
1. Autenticacion conectada al backend NestJS.
2. Dashboards por rol conectados a API real.
3. Persistencia local limitada a la sesion autenticada.

## Requisitos
1. Node.js 20+
2. Backend NestJS corriendo en `http://localhost:3000`

## Variables de entorno
1. `VITE_API_BASE_URL=http://localhost:3000/api/v1`

## Comandos
1. `npm install`
2. `npm run build`
3. `npm run dev`
4. `npm run preview`

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
