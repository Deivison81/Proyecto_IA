import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  AddTicketNoteInput,
  AssignTicketInput,
  CreateTicketInput,
  TicketRepositoryPort,
  UpdateTicketStatusInput,
} from '../../../../domain/tickets/ticket-repository.port';
import type { Ticket } from '../../../../domain/tickets/ticket';
import type { UserRole } from '../../../../domain/users/user-role.enum';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketUpdateEntity } from '../entities/ticket-update.entity';

@Injectable()
export class TypeormTicketRepository implements TicketRepositoryPort {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketUpdateEntity)
    private readonly updateRepository: Repository<TicketUpdateEntity>,
  ) {}

  async create(input: CreateTicketInput): Promise<Ticket> {
    const nextCode = await this.generateNextCode();

    const ticketEntity = this.ticketRepository.create({
      code: nextCode,
      title: input.title,
      service: input.service,
      priority: input.priority,
      status: input.initialStatus,
      description: input.description,
      evidence: input.evidence,
      diagnosis: input.diagnosis,
      requesterType: input.requesterType,
      clientName: input.clientName,
      createdByUserId: input.createdByUserId,
      assignedToUserId: null,
    });

    const savedTicket = await this.ticketRepository.save(ticketEntity);

    await this.updateRepository.save(
      this.updateRepository.create({
        ticketId: savedTicket.id,
        authorName: input.initialAuthor,
        note: input.initialNote,
      }),
    );

    const fullTicket = await this.findEntityById(savedTicket.id);
    if (!fullTicket) {
      throw new Error('No fue posible cargar el ticket creado.');
    }

    return this.toDomain(fullTicket);
  }

  async findById(ticketId: string): Promise<Ticket | null> {
    const entity = await this.findEntityById(ticketId);
    return entity ? this.toDomain(entity) : null;
  }

  async listByRole(role: UserRole, userId: string): Promise<Ticket[]> {
    const query = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.updates', 'updates')
      .leftJoinAndSelect('ticket.createdByUser', 'createdByUser')
      .leftJoinAndSelect('ticket.assignedToUser', 'assignedToUser');

    if (role === 'client') {
      query.where('ticket.createdByUserId = :userId', { userId });
    } else if (role === 'technician') {
      query.where(
        'ticket.assignedToUserId = :userId OR ticket.assignedToUserId IS NULL',
        {
          userId,
        },
      );
    }

    const entities = await query
      .orderBy('ticket.createdAt', 'DESC')
      .addOrderBy('updates.createdAt', 'ASC')
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async assign(input: AssignTicketInput): Promise<Ticket | null> {
    const ticket = await this.findEntityById(input.ticketId);
    if (!ticket) {
      return null;
    }

    ticket.assignedToUserId = input.technicianUserId;
    ticket.status =
      ticket.status === 'Disponible' || ticket.status === 'Nuevo'
        ? 'Asignado'
        : ticket.status;

    if (input.priority) {
      ticket.priority = input.priority;
    }

    await this.ticketRepository.save(ticket);
    await this.updateRepository.save(
      this.updateRepository.create({
        ticketId: ticket.id,
        authorName: input.author,
        note: input.note,
      }),
    );

    const updatedTicket = await this.findEntityById(ticket.id);
    return updatedTicket ? this.toDomain(updatedTicket) : null;
  }

  async updateStatus(input: UpdateTicketStatusInput): Promise<Ticket | null> {
    const ticket = await this.findEntityById(input.ticketId);
    if (!ticket) {
      return null;
    }

    ticket.status = input.status;
    await this.ticketRepository.save(ticket);

    await this.updateRepository.save(
      this.updateRepository.create({
        ticketId: ticket.id,
        authorName: input.author,
        note: input.note,
      }),
    );

    const updatedTicket = await this.findEntityById(ticket.id);
    return updatedTicket ? this.toDomain(updatedTicket) : null;
  }

  async addNote(input: AddTicketNoteInput): Promise<Ticket | null> {
    const ticket = await this.findEntityById(input.ticketId);
    if (!ticket) {
      return null;
    }

    await this.updateRepository.save(
      this.updateRepository.create({
        ticketId: ticket.id,
        authorName: input.author,
        note: input.note,
      }),
    );

    const updatedTicket = await this.findEntityById(ticket.id);
    return updatedTicket ? this.toDomain(updatedTicket) : null;
  }

  private async findEntityById(ticketId: string): Promise<TicketEntity | null> {
    return this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: {
        updates: true,
        createdByUser: true,
        assignedToUser: true,
      },
      order: {
        updates: {
          createdAt: 'ASC',
        },
      },
    });
  }

  private async generateNextCode(): Promise<string> {
    const lastTicket = await this.ticketRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
      select: { code: true },
    });

    const lastNumber = Number(lastTicket?.code.replace('TK-', '') ?? '2000');
    const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 2001;

    return `TK-${nextNumber}`;
  }

  private toDomain(entity: TicketEntity): Ticket {
    return {
      id: entity.id,
      code: entity.code,
      title: entity.title,
      service: entity.service,
      priority: entity.priority,
      status: entity.status,
      description: entity.description,
      evidence: entity.evidence,
      diagnosis: entity.diagnosis,
      requesterType: entity.requesterType,
      clientName: entity.clientName,
      createdByUserId: entity.createdByUserId,
      assignedToUserId: entity.assignedToUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      updates: entity.updates.map((update) => ({
        id: update.id,
        at: update.createdAt,
        author: update.authorName,
        note: update.note,
      })),
    };
  }
}
