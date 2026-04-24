import type { TicketPriority } from './ticket-priority.type';
import type { TicketStatus } from './ticket-status.type';

export interface TicketUpdate {
  id: string;
  at: Date;
  author: string;
  note: string;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  service: string;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  evidence: string | null;
  diagnosis: string | null;
  requesterType: 'client' | 'internal';
  clientName: string;
  createdByUserId: string;
  assignedToUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  updates: TicketUpdate[];
}
