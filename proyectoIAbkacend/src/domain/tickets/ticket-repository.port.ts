import type { UserRole } from '../users/user-role.enum';
import type { TicketPriority } from './ticket-priority.type';
import type { TicketStatus } from './ticket-status.type';
import type { Ticket } from './ticket';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface CreateTicketInput {
  title: string;
  service: string;
  priority: TicketPriority;
  description: string;
  evidence: string | null;
  diagnosis: string | null;
  requesterType: 'client' | 'internal';
  clientName: string;
  createdByUserId: string;
  initialStatus: TicketStatus;
  initialAuthor: string;
  initialNote: string;
}

export interface AssignTicketInput {
  ticketId: string;
  technicianUserId: string;
  priority?: TicketPriority;
  author: string;
  note: string;
}

export interface UpdateTicketStatusInput {
  ticketId: string;
  status: TicketStatus;
  author: string;
  note: string;
}

export interface AddTicketNoteInput {
  ticketId: string;
  author: string;
  note: string;
}

export interface TicketRepositoryPort {
  create(input: CreateTicketInput): Promise<Ticket>;
  findById(ticketId: string): Promise<Ticket | null>;
  listByRole(role: UserRole, userId: string): Promise<Ticket[]>;
  assign(input: AssignTicketInput): Promise<Ticket | null>;
  updateStatus(input: UpdateTicketStatusInput): Promise<Ticket | null>;
  addNote(input: AddTicketNoteInput): Promise<Ticket | null>;
}
