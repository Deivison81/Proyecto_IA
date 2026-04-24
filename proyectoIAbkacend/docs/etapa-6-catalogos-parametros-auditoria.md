# Etapa 6 - Modulo Catalogos, parametros globales y auditoria

## Objetivo
Implementar gestion de catalogos globales, configuraciones de plataforma y trazabilidad de cambios mediante auditoria.

## Entregables implementados
1. Catalogos persistentes por categoria:
   - service
   - priority
   - status
2. Parametros globales de plataforma:
   - maintenanceMode
   - allowClientRegistration
   - slaHours
3. Auditoria de cambios de catalogo y settings.

## Endpoints
1. GET /api/v1/catalogs
2. POST /api/v1/catalogs/items (roles: platform_admin, administrative)
3. PATCH /api/v1/catalogs/items/:itemId (roles: platform_admin, administrative)
4. GET /api/v1/platform/settings
5. PATCH /api/v1/platform/settings (rol: platform_admin)
6. GET /api/v1/platform/audit (rol: platform_admin)

## Persistencia
1. Tabla catalog_items
2. Tabla platform_settings
3. Tabla audit_logs
4. Migracion: 1714000002000-CreateCatalogSettingsAuditTables

## Validacion tecnica ejecutada
1. npm run lint
2. npm run build
3. npm run test -- --runInBand
4. npm run migration:run
5. Prueba runtime:
   - Creacion y desactivacion de item de catalogo.
   - Actualizacion de platform settings.
   - Consulta de auditoria con acciones registradas.
