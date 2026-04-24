# proyectoIAbkacend

Backend NestJS para Proyecto IA, usando Clean Architecture, PostgreSQL, TypeORM y Swagger.

## Etapa actual
Etapa 9: Calidad y release completada.

## Primer arranque
1. Copiar variables de entorno:
   - Windows PowerShell:
     Copy-Item .env.example .env
2. Levantar infraestructura:
   - docker compose up -d
3. Verificar servicios:
   - Backend API: http://localhost:3000/api
   - PostgreSQL: localhost:5433
   - pgAdmin: http://localhost:5050
4. Si trabajas fuera de Docker, levantar backend local:
   - npm run start:dev
   - API base: http://localhost:3000/api
   - Swagger: http://localhost:3000/api/docs
   - Health check: http://localhost:3000/api/v1/health
   - Auth register: POST http://localhost:3000/api/v1/auth/register
   - Auth login: POST http://localhost:3000/api/v1/auth/login
   - Tickets list: GET http://localhost:3000/api/v1/tickets
   - Tickets create: POST http://localhost:3000/api/v1/tickets
   - Tickets assign: PATCH http://localhost:3000/api/v1/tickets/:ticketId/assign
   - Tickets status: PATCH http://localhost:3000/api/v1/tickets/:ticketId/status
   - Tickets note: POST http://localhost:3000/api/v1/tickets/:ticketId/notes
   - Catalogos: GET http://localhost:3000/api/v1/catalogs
   - Catalogos upsert: POST http://localhost:3000/api/v1/catalogs/items
   - Catalogos toggle: PATCH http://localhost:3000/api/v1/catalogs/items/:itemId
   - Platform settings: GET/PATCH http://localhost:3000/api/v1/platform/settings
   - Auditoria plataforma: GET http://localhost:3000/api/v1/platform/audit

## Calidad validada
1. Unit tests reales sobre AuthService, TicketsService, CatalogsService y HealthService.
2. E2E de endpoints para health, login y validacion HTTP de auth.
3. Dockerfile multi-stage listo para empaquetar backend y ejecutar migraciones compiladas.
4. `docker-compose.yml` ahora levanta backend + postgres + pgAdmin.
5. `npm audit` ejecutado en Etapa 9: 2 vulnerabilidades moderadas heredadas por `typeorm -> uuid`.

## Correo SMTP
1. Variables de entorno:
   - MAIL_ENABLED=true|false
   - MAIL_FROM
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASS
2. Si MAIL_ENABLED=false, los correos se simulan en logs (modo desarrollo).

## Accesos
1. pgAdmin:
   - Usuario: admin@proyectoia.com
   - Clave: admin123
2. Base de datos:
   - DB: proyectoia_db
   - Usuario: proyectoia_user
   - Puerto host: 5433

## Estado consolidado
1. Proyecto NestJS inicializado en esta carpeta.
2. Estructura base creada por capas:
   - src/domain
   - src/application
   - src/infrastructure
   - src/interfaces
3. Configuracion base de entorno y validaciones activada con ConfigModule.
4. TypeORM integrado con PostgreSQL mediante variables de entorno.
5. Swagger global habilitado en /api/docs con versionado URI v1.
6. Endpoint de health check operativo en /api/v1/health.
7. Registro/login JWT implementado con usuarios persistidos en PostgreSQL.
8. Guard JWT y guard por rol habilitados para recursos protegidos.
9. Roles alineados con frontend: client, technician, administrative, platform_admin.
10. Tickets persistidos con historial de seguimiento (ticket_updates).
11. Flujos base por rol: crear, listar, asignar tecnico, actualizar estado y notas.
12. Catalogos globales activos para servicios, prioridades y estados.
13. Parametros globales de plataforma (maintenanceMode, allowClientRegistration, slaHours).
14. Auditoria persistente de cambios de catalogo y configuracion de plataforma.
15. Provider SMTP integrado con adaptador desacoplado por interfaz.
16. Plantillas base de correo para registro, asignacion y cierre de ticket.
17. Notificaciones conectadas a flujos: registro de usuario, asignacion de ticket y cierre de ticket.
18. Suite de pruebas backend actualizada para servicios y endpoints clave.
19. Empaquetado Docker listo para backend + DB con healthcheck y migraciones al arranque.
20. Documentacion de release y despliegue agregada en docs/.

## Migraciones
1. Generar migracion:
   - npm run migration:generate
2. Ejecutar migraciones:
   - npm run migration:run
   - Docker/prod build: npm run migration:run:prod
3. Revertir ultima migracion:
   - npm run migration:revert

## Documentacion relacionada
1. docs/etapa-7-envio-correos.md
2. docs/etapa-9-calidad-release.md
3. docs/guia-despliegue.md
