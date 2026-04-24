# Roadmap Backend - proyectoIAbkacend

## Objetivo
Construir un backend en NestJS para el frontend actual, con arquitectura limpia, PostgreSQL + TypeORM, Swagger para pruebas, y envio de correos.

## Principios de arquitectura
1. Clean Architecture por capas (Domain, Application, Infrastructure, Interfaces).
2. Separacion estricta entre:
   - Entidades/modelos de dominio.
   - Entidades ORM (persistencia).
   - DTOs de entrada/salida de controladores.
3. Casos de uso sin dependencia de framework.
4. Dependencias invertidas mediante interfaces/puertos.

## Etapas

### Etapa 1 - Infraestructura Docker (actual)
1. Docker Compose con PostgreSQL.
2. Inicializacion de base de datos.
3. Variables de entorno estandarizadas.
4. Verificacion de servicios.

### Etapa 2 - Bootstrap de NestJS + Clean Architecture
1. Crear proyecto NestJS en carpeta proyectoIAbkacend.
2. Estructura base por capas:
   - src/domain
   - src/application
   - src/infrastructure
   - src/interfaces
3. Configuracion base de entorno y validaciones.

### Etapa 3 - Base tecnica (TypeORM + Config + Swagger)
1. Integracion TypeORM con PostgreSQL.
2. Configuracion de migraciones.
3. Swagger global y versionado de API.
4. Health check del backend.

### Etapa 4 - Modulo Auth y usuarios
1. Usuarios, roles y permisos base.
2. Registro/login con JWT.
3. Guards por rol.
4. DTOs separados de entidades de dominio y persistencia.

Estado: completada y validada.
Evidencia: proyectoIAbkacend/docs/etapa-4-auth-usuarios.md

### Etapa 5 - Modulo Tickets (alineado al frontend)
1. Crear ticket (cliente/interno).
2. Listar tickets por rol.
3. Asignacion tecnica (admin).
4. Cambio de estado y notas de seguimiento.

Estado: completada y validada.
Evidencia: proyectoIAbkacend/docs/etapa-5-modulo-tickets.md

### Etapa 6 - Modulo Catalogos y parametros globales
1. Servicios, prioridades y estados.
2. Parametros de plataforma (SLA, mantenimiento, etc).
3. Auditoria de cambios.

Estado: completada y validada.
Evidencia: proyectoIAbkacend/docs/etapa-6-catalogos-parametros-auditoria.md

### Etapa 7 - Envio de correos
1. Integracion de provider SMTP.
2. Plantillas base (registro, asignacion, cierre).
3. Adaptador de infraestructura desacoplado por interfaz.

Estado: completada y validada.
Evidencia: proyectoIAbkacend/docs/etapa-7-envio-correos.md

### Etapa 8 - Integracion con frontend
1. Reemplazo progresivo de mocks por API real.
2. Ajuste de contratos DTO.
3. Manejo de errores y trazabilidad.

Estado: completada y validada.
Evidencia: docs/etapa-8-integracion-frontend.md

### Etapa 9 - Calidad y release
1. Pruebas unitarias e integracion backend.
2. Checklist de predespliegue.
3. Docker para app backend + DB.
4. Guia de despliegue sin ejecutar produccion.
5. Revision de vulnerabilidades de dependencias con npm audit y plan de remediacion.

Estado: completada y validada.
Evidencia: proyectoIAbkacend/docs/etapa-9-calidad-release.md

## Pendientes para verificacion posterior
1. Seguridad de dependencias backend:
   - Estado verificado en Etapa 9: 2 vulnerabilidades moderadas reportadas por npm audit en `typeorm -> uuid`.
   - Accion diferida: evaluar upgrade compatible de TypeORM cuando el ecosistema de Nest/TypeORM usado por el proyecto permita corregir la dependencia transitiva sin regresiones funcionales.

## Entregable por etapa
Cada etapa se cierra con:
1. Estado funcional verificable.
2. Documentacion corta en docs/.
3. Validacion tecnica (build, lint, pruebas clave).
