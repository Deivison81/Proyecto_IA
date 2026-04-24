import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import type { TicketRepositoryPort } from '../../domain/tickets/ticket-repository.port';
import type { UserRepositoryPort } from '../../domain/users/user-repository.port';
import { NotificationService } from '../notifications/notification.service';
import type { AuthenticatedUser } from '../../interfaces/http/auth/types/authenticated-user';

describe('TicketsService', () => {
  const ticketRepository: jest.Mocked<TicketRepositoryPort> = {
    create: jest.fn(),
    findById: jest.fn(),
    listByRole: jest.fn(),
    assign: jest.fn(),
    updateStatus: jest.fn(),
    addNote: jest.fn(),
  };

  const userRepository: jest.Mocked<UserRepositoryPort> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
  };

  const notificationService = {
    sendTicketAssignmentEmail: jest.fn(),
    sendTicketClosureEmail: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const service = new TicketsService(
    ticketRepository,
    userRepository,
    notificationService,
  );

  const clientUser: AuthenticatedUser = {
    id: 'client-1',
    email: 'client@empresa.com',
    role: 'client',
    name: 'Cliente Uno',
  };

  const technicianUser: AuthenticatedUser = {
    id: 'tech-1',
    email: 'tech@empresa.com',
    role: 'technician',
    name: 'Tecnico Uno',
  };

  const adminUser: AuthenticatedUser = {
    id: 'admin-1',
    email: 'admin@empresa.com',
    role: 'administrative',
    name: 'Admin Uno',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates client tickets with Nuevo status and client note', async () => {
    ticketRepository.create.mockImplementation(async (input) => ({
      id: 'ticket-1',
      code: 'TK-2001',
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
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    }));

    const result = await service.create(clientUser, {
      title: '  Error en acceso  ',
      service: ' Soporte TI general ',
      priority: 'Alta',
      description: '  No puedo acceder al sistema desde las 7 am.  ',
      evidence: ' captura ',
    });

    expect(ticketRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error en acceso',
        service: 'Soporte TI general',
        requesterType: 'client',
        initialStatus: 'Nuevo',
        initialNote: 'Solicitud registrada desde el portal de cliente.',
      }),
    );
    expect(result.status).toBe('Nuevo');
  });

  it('prevents technicians from assigning tickets to another technician', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'tech-2',
      name: 'Otro Tecnico',
      email: 'other@empresa.com',
      passwordHash: 'hash',
      role: 'technician',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.assign(technicianUser, 'ticket-1', {
        technicianEmail: 'other@empresa.com',
        note: 'Me asigno este ticket',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows a technician to self-assign an available ticket', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'tech-1',
      name: 'Tecnico Uno',
      email: 'tech@empresa.com',
      passwordHash: 'hash',
      role: 'technician',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    ticketRepository.findById.mockResolvedValue({
      id: 'ticket-1',
      code: 'TK-2001',
      title: 'Caso',
      service: 'Soporte TI general',
      priority: 'Alta',
      status: 'Disponible',
      description: 'Descripcion extensa',
      evidence: null,
      diagnosis: null,
      requesterType: 'internal',
      clientName: 'Cliente',
      createdByUserId: 'client-1',
      assignedToUserId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    });
    ticketRepository.assign.mockResolvedValue({
      id: 'ticket-1',
      code: 'TK-2001',
      title: 'Caso',
      service: 'Soporte TI general',
      priority: 'Alta',
      status: 'Asignado',
      description: 'Descripcion extensa',
      evidence: null,
      diagnosis: null,
      requesterType: 'internal',
      clientName: 'Cliente',
      createdByUserId: 'client-1',
      assignedToUserId: 'tech-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    });
    userRepository.findById.mockResolvedValue({
      id: 'client-1',
      name: 'Cliente Uno',
      email: 'client@empresa.com',
      passwordHash: 'hash',
      role: 'client',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.assign(technicianUser, 'ticket-1', {
      technicianEmail: 'tech@empresa.com',
      note: 'Tomo el caso para gestion.',
    });

    expect(ticketRepository.assign).toHaveBeenCalled();
    expect(notificationService.sendTicketAssignmentEmail).toHaveBeenCalledTimes(2);
    expect(result.status).toBe('Asignado');
  });

  it('rejects invalid ticket priorities', async () => {
    await expect(
      service.create(clientUser, {
        title: 'Caso invalido',
        service: 'Soporte',
        priority: 'Urgente' as never,
        description: 'Descripcion suficientemente larga',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sends closure email when a ticket is resolved', async () => {
    ticketRepository.findById.mockResolvedValue({
      id: 'ticket-2',
      code: 'TK-2002',
      title: 'Caso',
      service: 'Soporte',
      priority: 'Alta',
      status: 'En proceso',
      description: 'Descripcion extensa',
      evidence: null,
      diagnosis: null,
      requesterType: 'client',
      clientName: 'Cliente',
      createdByUserId: 'client-1',
      assignedToUserId: 'tech-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    });
    ticketRepository.updateStatus.mockResolvedValue({
      id: 'ticket-2',
      code: 'TK-2002',
      title: 'Caso',
      service: 'Soporte',
      priority: 'Alta',
      status: 'Resuelto',
      description: 'Descripcion extensa',
      evidence: null,
      diagnosis: null,
      requesterType: 'client',
      clientName: 'Cliente',
      createdByUserId: 'client-1',
      assignedToUserId: 'tech-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    });
    userRepository.findById.mockResolvedValue({
      id: 'client-1',
      name: 'Cliente Uno',
      email: 'client@empresa.com',
      passwordHash: 'hash',
      role: 'client',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.updateStatus(technicianUser, 'ticket-2', {
      status: 'Resuelto',
      note: 'Incidencia solucionada definitivamente.',
    });

    expect(notificationService.sendTicketClosureEmail).toHaveBeenCalledWith(
      'client@empresa.com',
      'Cliente Uno',
      'TK-2002',
      'Caso',
      'Tecnico Uno',
    );
    expect(result.status).toBe('Resuelto');
  });

  it('prevents clients from changing ticket status', async () => {
    ticketRepository.findById.mockResolvedValue({
      id: 'ticket-3',
      code: 'TK-2003',
      title: 'Caso',
      service: 'Soporte',
      priority: 'Media',
      status: 'Nuevo',
      description: 'Descripcion extensa',
      evidence: null,
      diagnosis: null,
      requesterType: 'client',
      clientName: 'Cliente',
      createdByUserId: 'client-1',
      assignedToUserId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    });

    await expect(
      service.updateStatus(clientUser, 'ticket-3', {
        status: 'En proceso',
        note: 'Intento cambiar estado',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws when adding a note to a missing ticket', async () => {
    ticketRepository.findById.mockResolvedValue(null);

    await expect(
      service.addNote(adminUser, 'missing', { note: 'Seguimiento operativo' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});