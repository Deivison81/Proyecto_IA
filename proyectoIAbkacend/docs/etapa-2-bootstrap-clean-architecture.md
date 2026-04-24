# Etapa 2 - Bootstrap NestJS + Clean Architecture

## Objetivo de la etapa
Dejar una base funcional del backend con NestJS y estructura por capas, lista para incorporar TypeORM, Swagger y modulos de negocio en etapas siguientes.

## Checklist de cierre
1. Proyecto NestJS creado dentro de proyectoIAbkacend.
2. Estructura base por capas disponible:
   - src/domain
   - src/application
   - src/infrastructure
   - src/interfaces
3. Configuracion de entorno cargada de forma global.
4. Validacion de variables obligatorias al arrancar la aplicacion.
5. Verificacion tecnica con lint, build y test.

## Implementacion realizada
1. Bootstrap NestJS operativo con scripts estandar.
2. ConfigModule global en AppModule.
3. Validacion centralizada de variables en src/config/env.validation.ts.
4. Alineacion de .env.example con puertos operativos del entorno actual.

## Resultado
Etapa 2 cerrada funcionalmente y lista para Etapa 3 (TypeORM + Swagger + versionado API).
