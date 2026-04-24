# Etapa 3 - Base tecnica (TypeORM + Config + Swagger)

## Objetivo
Implementar la base tecnica del backend para persistencia, documentacion y observabilidad minima.

## Entregables implementados
1. Integracion de TypeORM con PostgreSQL en AppModule.
2. Configuracion de migraciones con DataSource dedicado.
3. Swagger global en /api/docs.
4. Versionado de API por URI con prefijo /api/v1.
5. Health check con estado de API y base de datos.

## Archivos clave
1. src/app.module.ts
2. src/main.ts
3. src/infrastructure/database/typeorm/data-source.ts
4. src/interfaces/http/health/health.controller.ts
5. src/interfaces/http/health/health.service.ts
6. src/config/env.validation.ts

## Validacion esperada
1. npm run lint
2. npm run build
3. npm test -- --runInBand
4. GET http://localhost:3000/api/v1/health
5. Swagger en http://localhost:3000/api/docs
