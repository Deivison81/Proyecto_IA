import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationService } from '../notifications/notification.service';
import { TICKET_REPOSITORY } from '../../domain/tickets/ticket-repository.port';
import {
  TICKET_STATUSES,
  TicketStatus,
} from '../../domain/tickets/ticket-status.type';
import {
  TICKET_PRIORITIES,
  TicketPriority,
} from '../../domain/tickets/ticket-priority.type';
import { USER_REPOSITORY } from '../../domain/users/user-repository.port';
import type { UserRepositoryPort } from '../../domain/users/user-repository.port';
import type { UserRole } from '../../domain/users/user-role.enum';
import type { AuthenticatedUser } from '../../interfaces/http/auth/types/authenticated-user';
import type { TicketRepositoryPort } from '../../domain/tickets/ticket-repository.port';

interface CreateTicketInput {
  title: string;
  service: string;
  priority: TicketPriority;
  description: string;
  evidence?: string;
  diagnosis?: string;
  clientName?: string;
}

interface AssignTicketInput {
  technicianEmail: string;
  note: string;
  priority?: TicketPriority;
}

interface UpdateStatusInput {
  status: TicketStatus;
  note: string;
}

interface AddNoteInput {
  note: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly notificationService: NotificationService,
  ) {}

  async create(currentUser: AuthenticatedUser, input: CreateTicketInput) {
    this.assertPriority(input.priority);

    const isClient = currentUser.role === 'client';
    const requesterType = isClient ? 'client' : 'internal';
    const initialStatus: TicketStatus = isClient ? 'Nuevo' : 'Disponible';

    const ticket = await this.ticketRepository.create({
      title: input.title.trim(),
      service: input.service.trim(),
      priority: input.priority,
      description: input.description.trim(),
      evidence: input.evidence?.trim() ? input.evidence.trim() : null,
      diagnosis: input.diagnosis?.trim() ? input.diagnosis.trim() : null,
      requesterType,
      clientName: isClient
        ? currentUser.name
        : input.clientName?.trim() || 'Cliente interno',
      createdByUserId: currentUser.id,
      initialStatus,
      initialAuthor: currentUser.name,
      initialNote: isClient
        ? 'Solicitud registrada desde el portal de cliente.'
        : 'Ticket interno creado por personal operativo.',
    });

    return ticket;
  }

  async list(currentUser: AuthenticatedUser) {
    return this.ticketRepository.listByRole(currentUser.role, currentUser.id);
  }

  async assign(
    currentUser: AuthenticatedUser,
    ticketId: string,
    input: AssignTicketInput,
  ) {
    this.assertPriority(input.priority);

    const technician = await this.userRepository.findByEmail(
      input.technicianEmail.toLowerCase().trim(),
    );

    if (
      !technician ||
      !technician.isActive ||
      technician.role !== 'technician'
    ) {
      throw new BadRequestException(
        'No se encontro un tecnico activo con ese email.',
      );
    }

    if (currentUser.role === 'technician') {
      if (technician.id !== currentUser.id) {
        throw new ForbiddenException(
          'Solo puedes asignarte tickets a tu propio usuario.',
        );
      }

      const ticket = await this.ticketRepository.findById(ticketId);
      if (!ticket) {
        throw new NotFoundException('Ticket no encontrado.');
      }

      if (ticket.assignedToUserId && ticket.assignedToUserId !== currentUser.id) {
        throw new ForbiddenException('El ticket ya se encuentra asignado.');
      }
    } else {
      this.assertRole(currentUser.role, ['administrative', 'platform_admin']);
    }

    const updated = await this.ticketRepository.assign({
      ticketId,
      technicianUserId: technician.id,
      priority: input.priority,
      author: currentUser.name,
      note: input.note.trim(),
    });

    if (!updated) {
      throw new NotFoundException('Ticket no encontrado.');
    }

    await this.sendTicketAssignmentEmails(
      updated.code,
      updated.title,
      currentUser.name,
      updated.createdByUserId,
      {
        id: technician.id,
        name: technician.name,
        email: technician.email,
      },
    );

    return updated;
  }

  async updateStatus(
    currentUser: AuthenticatedUser,
    ticketId: string,
    input: UpdateStatusInput,
  ) {
    this.assertStatus(input.status);

    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado.');
    }

    if (currentUser.role === 'technician') {
      if (ticket.assignedToUserId !== currentUser.id) {
        throw new ForbiddenException(
          'Solo puedes actualizar tickets asignados a tu usuario.',
        );
      }
    } else if (currentUser.role === 'client') {
      throw new ForbiddenException(
        'El rol cliente no puede actualizar estados operativos.',
      );
    }

    const updated = await this.ticketRepository.updateStatus({
      ticketId,
      status: input.status,
      author: currentUser.name,
      note: input.note.trim(),
    });

    if (!updated) {
      throw new NotFoundException('Ticket no encontrado.');
    }

    if (updated.status === 'Resuelto') {
      await this.sendTicketClosureEmail(
        updated.createdByUserId,
        updated.code,
        updated.title,
        currentUser.name,
      );
    }

    return updated;
  }

  async addNote(
    currentUser: AuthenticatedUser,
    ticketId: string,
    input: AddNoteInput,
  ) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado.');
    }

    if (
      currentUser.role === 'client' &&
      ticket.createdByUserId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'No puedes agregar notas a tickets de otros usuarios.',
      );
    }

    if (
      currentUser.role === 'technician' &&
      ticket.assignedToUserId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Solo puedes agregar notas a tickets asignados a tu usuario.',
      );
    }

    const updated = await this.ticketRepository.addNote({
      ticketId,
      author: currentUser.name,
      note: input.note.trim(),
    });

    if (!updated) {
      throw new NotFoundException('Ticket no encontrado.');
    }

    return updated;
  }

  private assertRole(role: UserRole, allowed: UserRole[]) {
    if (!allowed.includes(role)) {
      throw new ForbiddenException('No tienes permisos para esta operacion.');
    }
  }

  private assertStatus(status: TicketStatus) {
    if (!TICKET_STATUSES.includes(status)) {
      throw new BadRequestException('Estado de ticket no valido.');
    }
  }

  private assertPriority(priority: TicketPriority | undefined) {
    if (priority && !TICKET_PRIORITIES.includes(priority)) {
      throw new BadRequestException('Prioridad de ticket no valida.');
    }
  }

  private async sendTicketAssignmentEmails(
    ticketCode: string,
    ticketTitle: string,
    assignedBy: string,
    requesterUserId: string,
    technician: { id: string; name: string; email: string },
  ): Promise<void> {
    await this.notificationService.sendTicketAssignmentEmail(
      technician.email,
      technician.name,
      ticketCode,
      ticketTitle,
      assignedBy,
    );

    const requester = await this.userRepository.findById(requesterUserId);
    if (requester) {
      await this.notificationService.sendTicketAssignmentEmail(
        requester.email,
        requester.name,
        ticketCode,
        ticketTitle,
        assignedBy,
      );
    }
  }

  private async sendTicketClosureEmail(
    requesterUserId: string,
    ticketCode: string,
    ticketTitle: string,
    closedBy: string,
  ): Promise<void> {
    const requester = await this.userRepository.findById(requesterUserId);
    if (!requester) {
      return;
    }

    await this.notificationService.sendTicketClosureEmail(
      requester.email,
      requester.name,
      ticketCode,
      ticketTitle,
      closedBy,
    );
  }
}
