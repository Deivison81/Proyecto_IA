# Etapa 5 - Modulo Tickets

## Objetivo
Implementar backend de tickets alineado al frontend para operaciones de cliente, tecnico y administrativo.

## Entregables implementados
1. Creacion de tickets cliente e internos.
2. Listado de tickets por visibilidad de rol:
   - client: solo sus tickets.
   - technician: tickets asignados a su usuario y disponibles.
   - administrative/platform_admin: todos los tickets.
3. Asignacion tecnica por administrativos/plataforma.
4. Cambio de estado con nota operativa.
5. Notas de seguimiento adicionales.
6. Persistencia en PostgreSQL con tablas tickets y ticket_updates.

## Endpoints
1. POST /api/v1/tickets
2. GET /api/v1/tickets
3. PATCH /api/v1/tickets/:ticketId/assign
4. PATCH /api/v1/tickets/:ticketId/status
5. POST /api/v1/tickets/:ticketId/notes

## Modelo base
1. Ticket:
   - code, title, service, priority, status, description.
   - evidence, diagnosis.
   - requesterType, clientName.
   - createdByUserId, assignedToUserId.
2. TicketUpdate:
   - ticketId, authorName, note, createdAt.

## Migraciones
1. 1714000001000-CreateTicketsTables

## Validacion tecnica ejecutada
1. npm run lint
2. npm run build
3. npm run test -- --runInBand
4. npm run migration:run
5. Prueba runtime por rol:
   - Cliente crea ticket.
   - Admin asigna tecnico.
   - Tecnico actualiza estado.
   - Cliente recibe 403 al intentar cambiar estado.
