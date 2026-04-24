import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import type { UserRepositoryPort } from '../../domain/users/user-repository.port';
import { NotificationService } from '../notifications/notification.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const userRepository: jest.Mocked<UserRepositoryPort> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  const notificationService = {
    sendRegistrationEmail: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const service = new AuthService(
    userRepository,
    jwtService,
    notificationService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.sign = jest.fn().mockReturnValue('signed-jwt');
  });

  it('registers a user and returns a signed token', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({
      id: 'user-1',
      name: 'Laura Gomez',
      email: 'laura@empresa.com',
      passwordHash: 'hashed-password',
      role: 'client',
      isActive: true,
      createdAt: new Date('2026-04-23T12:00:00Z'),
      updatedAt: new Date('2026-04-23T12:00:00Z'),
    });

    const result = await service.register({
      name: ' Laura Gomez ',
      email: 'LAURA@empresa.com',
      password: 'Demo1234',
      role: 'client',
    });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Laura Gomez',
        email: 'laura@empresa.com',
        passwordHash: 'hashed-password',
        role: 'client',
      }),
    );
    expect(notificationService.sendRegistrationEmail).toHaveBeenCalledWith(
      'laura@empresa.com',
      'Laura Gomez',
      'client',
    );
    expect(result).toEqual({
      accessToken: 'signed-jwt',
      tokenType: 'Bearer',
      user: {
        id: 'user-1',
        name: 'Laura Gomez',
        email: 'laura@empresa.com',
        role: 'client',
      },
    });
  });

  it('rejects duplicate emails on registration', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Existing',
      email: 'existing@empresa.com',
      passwordHash: 'hash',
      role: 'client',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.register({
        name: 'Existing',
        email: 'existing@empresa.com',
        password: 'Demo1234',
        role: 'client',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in an active user with valid password', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-2',
      name: 'Tech User',
      email: 'tech@empresa.com',
      passwordHash: 'stored-hash',
      role: 'technician',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login({
      email: 'TECH@empresa.com',
      password: 'Demo1234',
    });

    expect(result.user.role).toBe('technician');
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('rejects invalid credentials on login', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-2',
      name: 'Tech User',
      email: 'tech@empresa.com',
      passwordHash: 'stored-hash',
      role: 'technician',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'tech@empresa.com', password: 'bad-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('updates a user and returns the public profile', async () => {
    userRepository.update.mockResolvedValue({
      id: 'user-3',
      name: 'Admin',
      email: 'admin@empresa.com',
      passwordHash: 'hash',
      role: 'platform_admin',
      isActive: false,
      createdAt: new Date('2026-04-23T12:00:00Z'),
      updatedAt: new Date('2026-04-23T13:00:00Z'),
    });

    const result = await service.updateUser('user-3', { isActive: false });

    expect(result).toEqual({
      id: 'user-3',
      name: 'Admin',
      email: 'admin@empresa.com',
      role: 'platform_admin',
      isActive: false,
      createdAt: new Date('2026-04-23T12:00:00Z'),
    });
  });

  it('throws when updating a missing user', async () => {
    userRepository.update.mockResolvedValue(null);

    await expect(service.updateUser('missing', { role: 'client' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});