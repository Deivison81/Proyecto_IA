export const TICKET_PRIORITIES = ['Alta', 'Media', 'Baja'] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
