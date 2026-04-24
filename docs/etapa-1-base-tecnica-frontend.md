# Etapa 1 - Base tecnica y arquitectura frontend

## Objetivo cumplido
Se implemento la arquitectura base del frontend para separar:
1. Sitio publico.
2. Autenticacion.
3. Dashboards internos por rol.

## Estructura principal creada
- app/: router, layouts, proveedor de autenticacion, guardas de rutas.
- features/public/: paginas publicas del menu principal.
- features/auth/: pantalla de login demo por rol.
- features/dashboard/: paginas base de dashboard por rol.
- styles/: sistema visual global.
- types/: tipos compartidos de autenticacion y roles.

## Rutas publicas implementadas
1. /
2. /servicios
3. /quienes-somos
4. /contactanos
5. /registro-clientes
6. /login

## Rutas protegidas implementadas
1. /dashboard (autenticado)
2. /dashboard/cliente (rol client)
3. /dashboard/tecnico (rol technician)
4. /dashboard/administrativo (rol administrative)
5. /dashboard/admin-plataforma (rol platform_admin)

## Proteccion de rutas
Se implemento ProtectedRoute para:
1. Redirigir a /login cuando no hay sesion.
2. Validar allowedRoles por ruta.
3. Evitar acceso a secciones de otros roles.

## Sesion (modo demo)
AuthProvider maneja:
1. login por seleccion de rol.
2. persistencia en localStorage.
3. cierre de sesion.

## Sistema visual base
1. Variables CSS para color, bordes y espaciado.
2. Tipografia: Manrope + Space Grotesk.
3. Layout responsive para menu publico y dashboard.

## Criterio de validacion
Build de produccion ejecutado exitosamente despues de la implementacion.
