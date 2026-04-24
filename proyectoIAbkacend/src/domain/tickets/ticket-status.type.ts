export const TICKET_STATUSES = [
  'Nuevo',
  'Disponible',
  'Asignado',
  'En revision',
  'En proceso',
  'Resuelto',
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
