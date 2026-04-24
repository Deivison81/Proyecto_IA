# Etapa 4 - Modulo Auth y usuarios

## Objetivo
Implementar autenticacion real con JWT, persistencia de usuarios, roles base y control de acceso por rol.

## Entregables implementados
1. Modelo de usuario por capas:
   - Dominio: user, user-role, puerto de repositorio.
   - Infraestructura: entidad TypeORM y repositorio concreto.
   - Interfaces HTTP: controlador, DTOs, guards y decorators.
2. Registro de usuario con hash bcrypt.
3. Login con JWT (payload con id, email, rol y nombre).
4. Endpoint de perfil autenticado.
5. Endpoint protegido por rol para listar usuarios.
6. Migracion de base de datos para crear tabla users.

## Endpoints
1. POST /api/v1/auth/register
2. POST /api/v1/auth/login
3. GET /api/v1/auth/me (Bearer token)
4. GET /api/v1/auth/users (solo platform_admin)

## Roles base
1. client
2. technician
3. administrative
4. platform_admin

## Validaciones ejecutadas
1. npm run lint
2. npm run build
3. npm test -- --runInBand
4. npm run migration:run
5. Prueba runtime de register/login/me/users con validacion de guard por rol (403 para rol client en /auth/users).

## Variables de entorno nuevas
1. JWT_SECRET
2. JWT_EXPIRES_IN
