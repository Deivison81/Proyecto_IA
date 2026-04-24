# Etapa 7 - Envio de correos

## Objetivo
Incorporar notificaciones por correo desacopladas de la lógica de negocio, con proveedor SMTP y plantillas base reutilizables.

## Entregables implementados
1. Puerto de dominio para envio de correo.
2. Adaptador SMTP en infraestructura (nodemailer).
3. Plantillas base:
   - Registro de usuario.
   - Asignacion de ticket.
   - Cierre de ticket.
4. Servicio de notificaciones de aplicacion.
5. Integracion en flujos:
   - AuthService.register
   - TicketsService.assign
   - TicketsService.updateStatus (cuando estado = Resuelto)

## Archivos clave
1. src/domain/notifications/mail-service.port.ts
2. src/infrastructure/mail/smtp-mail.service.ts
3. src/infrastructure/mail/templates/mail-templates.ts
4. src/infrastructure/mail/mail.module.ts
5. src/application/notifications/notification.service.ts
6. src/application/auth/auth.service.ts
7. src/application/tickets/tickets.service.ts

## Configuracion de entorno
1. MAIL_ENABLED
2. MAIL_FROM
3. SMTP_HOST
4. SMTP_PORT
5. SMTP_USER
6. SMTP_PASS

## Validacion tecnica ejecutada
1. npm run lint
2. npm run build
3. npm run test -- --runInBand
4. Prueba runtime de flujo completo con MAIL_ENABLED=false:
   - registro
   - asignacion
   - cierre
   - evidencia en logs de correos simulados
