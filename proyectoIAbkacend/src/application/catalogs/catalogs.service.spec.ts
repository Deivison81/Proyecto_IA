import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogItemEntity } from '../../infrastructure/database/typeorm/entities/catalog-item.entity';
import { PlatformSettingEntity } from '../../infrastructure/database/typeorm/entities/platform-setting.entity';
import { AuditLogEntity } from '../../infrastructure/database/typeorm/entities/audit-log.entity';
import type { AuthenticatedUser } from '../../interfaces/http/auth/types/authenticated-user';

type MockRepository<T> = {
  find: jest.Mock;
  findOne: jest.Mock;
  save: jest.Mock;
  create: jest.Mock;
};

describe('CatalogsService', () => {
  const catalogRepository: MockRepository<CatalogItemEntity> = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  const settingsRepository: MockRepository<PlatformSettingEntity> = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  const auditRepository: MockRepository<AuditLogEntity> = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const service = new CatalogsService(
    catalogRepository as never,
    settingsRepository as never,
    auditRepository as never,
  );

  const adminUser: AuthenticatedUser = {
    id: 'admin-1',
    email: 'admin@empresa.com',
    role: 'platform_admin',
    name: 'Admin Uno',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    auditRepository.create.mockImplementation((payload) => payload);
    auditRepository.save.mockImplementation(async (payload) => payload);
  });

  it('returns grouped catalogs and active visible values', async () => {
    catalogRepository.find.mockResolvedValue([
      { id: '1', category: 'service', value: 'Soporte', isActive: true },
      { id: '2', category: 'priority', value: 'Alta', isActive: true },
      { id: '3', category: 'status', value: 'Resuelto', isActive: false },
    ]);

    const result = await service.getCatalogs();

    expect(result.services).toEqual(['Soporte']);
    expect(result.priorities).toEqual(['Alta']);
    expect(result.statuses).toEqual([]);
  });

  it('creates a new catalog item and writes audit', async () => {
    catalogRepository.findOne.mockResolvedValue(null);
    catalogRepository.create.mockImplementation((payload) => ({ id: 'new-item', ...payload }));
    catalogRepository.save.mockImplementation(async (payload) => payload);

    const result = await service.upsertCatalogItem(adminUser, {
      category: 'service',
      value: 'Monitoreo preventivo',
      isActive: true,
    });

    expect(result.value).toBe('Monitoreo preventivo');
    expect(auditRepository.save).toHaveBeenCalled();
  });

  it('rejects invalid SLA ranges', async () => {
    settingsRepository.find.mockResolvedValue([]);

    await expect(
      service.updatePlatformSettings(adminUser, { slaHours: 0 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates platform settings and persists audit', async () => {
    settingsRepository.find.mockResolvedValue([
      { key: 'maintenanceMode', value: 'false' },
      { key: 'allowClientRegistration', value: 'true' },
      { key: 'slaHours', value: '8' },
    ]);
    settingsRepository.findOne.mockResolvedValue(null);
    settingsRepository.create.mockImplementation((payload) => payload);
    settingsRepository.save.mockImplementation(async (payload) => payload);

    const result = await service.updatePlatformSettings(adminUser, {
      maintenanceMode: true,
      slaHours: 12,
    });

    expect(result).toEqual({
      maintenanceMode: true,
      allowClientRegistration: true,
      slaHours: 12,
    });
    expect(auditRepository.save).toHaveBeenCalled();
  });

  it('throws when toggling a missing catalog item', async () => {
    catalogRepository.findOne.mockResolvedValue(null);

    await expect(
      service.toggleCatalogItem(adminUser, 'missing-item', false),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});