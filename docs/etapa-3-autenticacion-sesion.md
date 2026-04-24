# Etapa 3 - Autenticacion y gestion de sesion

## Objetivo cumplido
Se fortalecio el acceso a plataforma con login por credenciales, sesion persistente con expiracion y control de rutas publicas/protegidas por rol.

## Cambios implementados
1. Login por email y contrasena sobre backend real.
2. Registro real por rol con JWT retornado desde NestJS.
3. Estado de autenticacion con manejo de carga y errores.
4. Sesion persistente en localStorage con expiracion de 8 horas y token real.
5. Logout con limpieza de sesion local.
6. Ruta publica solo para no autenticados (login y recuperar acceso).
7. Redireccion automatica al dashboard personalizado por rol.
8. Vista de recuperar acceso pendiente de flujo backend dedicado.

## Rutas relacionadas
1. /login
2. /recuperar-acceso
3. /dashboard (redireccion interna por rol)
4. /dashboard/resumen
5. /dashboard/cliente
6. /dashboard/tecnico
7. /dashboard/administrativo
8. /dashboard/admin-plataforma

## Credenciales de prueba
1. Se pueden usar usuarios reales creados en el backend.
2. Para pruebas manuales se pueden registrar usuarios desde `/login?tab=register`.

## Validacion tecnica
1. Lint: OK.
2. Build: OK.

## Nota
La autenticacion ya consume `/api/v1/auth` y forma parte del cierre de la Etapa 8.
