# Etapa 8 - Integracion con frontend

## Alcance implementado
1. El frontend deja de usar autenticacion mock en el provider principal.
2. Login y registro consumen el backend real en `/api/v1/auth/login` y `/api/v1/auth/register`.
3. La sesion sigue persistiendo en `localStorage`, pero ahora guarda el `accessToken` real retornado por NestJS.
4. El dashboard cliente consume `GET /tickets` y `POST /tickets`.
5. El dashboard tecnico consume `GET /tickets`, autoasignacion por `PATCH /tickets/:id/assign` y avance por `PATCH /tickets/:id/status`.
6. El dashboard administrativo consume tickets globales, listado de tecnicos y operaciones de asignacion/cierre.
7. El dashboard de plataforma consume usuarios, catalogos, parametros y auditoria reales.
8. El formulario publico de registro de clientes ya no cierra en demo: redirige al registro real.
9. Se agrega configuracion base `VITE_API_BASE_URL` con fallback a `http://localhost:3001/api/v1`.

## Archivos involucrados
1. `src/features/auth/auth-api.ts`
2. `src/app/providers/AuthProvider.tsx`
3. `src/app/providers/auth-context.ts`
4. `src/features/auth/pages/LoginPage.tsx`
5. `src/features/dashboard/tickets-api.ts`
6. `src/features/dashboard/platform-api.ts`
7. `src/features/dashboard/pages/ClientDashboardPage.tsx`
8. `src/features/dashboard/pages/TechnicianDashboardPage.tsx`
9. `src/features/dashboard/pages/AdministrativeDashboardPage.tsx`
10. `src/features/dashboard/pages/PlatformAdminDashboardPage.tsx`
11. `src/features/public/pages/ClientRegistrationPage.tsx`
12. `.env.example`
13. `proyectoIAbkacend/src/interfaces/http/auth/auth.controller.ts`
14. `proyectoIAbkacend/src/application/auth/auth.service.ts`
15. `proyectoIAbkacend/src/application/tickets/tickets.service.ts`

## Validacion ejecutada
1. `npm run build` en el frontend.
2. `npm run build` en el backend.

## Resultado
1. La Etapa 8 queda cerrada sin dashboards funcionales basados en `localStorage`.
2. `localStorage` queda limitado a la persistencia de sesion del frontend.