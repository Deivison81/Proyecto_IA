import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CATALOG_CATEGORIES,
  CatalogCategory,
  CatalogItemEntity,
} from '../../infrastructure/database/typeorm/entities/catalog-item.entity';
import { PlatformSettingEntity } from '../../infrastructure/database/typeorm/entities/platform-setting.entity';
import { AuditLogEntity } from '../../infrastructure/database/typeorm/entities/audit-log.entity';
import type { AuthenticatedUser } from '../../interfaces/http/auth/types/authenticated-user';

interface UpsertCatalogItemInput {
  category: CatalogCategory;
  value: string;
  isActive?: boolean;
}

interface UpdatePlatformSettingsInput {
  maintenanceMode?: boolean;
  allowClientRegistration?: boolean;
  slaHours?: number;
}

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(CatalogItemEntity)
    private readonly catalogRepository: Repository<CatalogItemEntity>,
    @InjectRepository(PlatformSettingEntity)
    private readonly settingsRepository: Repository<PlatformSettingEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditRepository: Repository<AuditLogEntity>,
  ) {}

  async getCatalogs() {
    const items = await this.catalogRepository.find({
      order: {
        category: 'ASC',
        value: 'ASC',
      },
    });

    return {
      services: items
        .filter((item) => item.category === 'service' && item.isActive)
        .map((item) => item.value),
      priorities: items
        .filter((item) => item.category === 'priority' && item.isActive)
        .map((item) => item.value),
      statuses: items
        .filter((item) => item.category === 'status' && item.isActive)
        .map((item) => item.value),
      items,
    };
  }

  async getPlatformSettings() {
    const settings = await this.settingsRepository.find();

    const map = new Map(
      settings.map((setting) => [setting.key, setting.value]),
    );

    return {
      maintenanceMode: map.get('maintenanceMode') === 'true',
      allowClientRegistration: map.get('allowClientRegistration') !== 'false',
      slaHours: Number(map.get('slaHours') ?? '8'),
    };
  }

  async upsertCatalogItem(
    user: AuthenticatedUser,
    input: UpsertCatalogItemInput,
  ) {
    if (!CATALOG_CATEGORIES.includes(input.category)) {
      throw new BadRequestException('Categoria de catalogo no valida.');
    }

    const value = input.value.trim();
    if (value.length < 3) {
      throw new BadRequestException(
        'El valor del catalogo debe tener minimo 3 caracteres.',
      );
    }

    const existing = await this.catalogRepository.findOne({
      where: { category: input.category, value },
    });

    const item = existing
      ? Object.assign(existing, {
          isActive: input.isActive ?? existing.isActive,
        })
      : this.catalogRepository.create({
          category: input.category,
          value,
          isActive: input.isActive ?? true,
        });

    const saved = await this.catalogRepository.save(item);

    await this.createAudit(
      user,
      existing ? 'catalog.item.updated' : 'catalog.item.created',
      {
        itemId: saved.id,
        category: saved.category,
        value: saved.value,
        isActive: saved.isActive,
      },
    );

    return saved;
  }

  async toggleCatalogItem(
    user: AuthenticatedUser,
    itemId: string,
    isActive: boolean,
  ) {
    const item = await this.catalogRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Item de catalogo no encontrado.');
    }

    item.isActive = isActive;
    const saved = await this.catalogRepository.save(item);

    await this.createAudit(user, 'catalog.item.toggled', {
      itemId: saved.id,
      category: saved.category,
      value: saved.value,
      isActive: saved.isActive,
    });

    return saved;
  }

  async updatePlatformSettings(
    user: AuthenticatedUser,
    input: UpdatePlatformSettingsInput,
  ) {
    const current = await this.getPlatformSettings();

    const next = {
      maintenanceMode: input.maintenanceMode ?? current.maintenanceMode,
      allowClientRegistration:
        input.allowClientRegistration ?? current.allowClientRegistration,
      slaHours: input.slaHours ?? current.slaHours,
    };

    if (
      !Number.isInteger(next.slaHours) ||
      next.slaHours < 1 ||
      next.slaHours > 168
    ) {
      throw new BadRequestException('slaHours debe estar entre 1 y 168 horas.');
    }

    await this.upsertSetting(
      'maintenanceMode',
      String(next.maintenanceMode),
      user.id,
    );
    await this.upsertSetting(
      'allowClientRegistration',
      String(next.allowClientRegistration),
      user.id,
    );
    await this.upsertSetting('slaHours', String(next.slaHours), user.id);

    await this.createAudit(user, 'platform.settings.updated', {
      previous: current,
      next,
    });

    return next;
  }

  async listAuditLogs() {
    return this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  private async upsertSetting(
    key: string,
    value: string,
    updatedByUserId: string,
  ): Promise<void> {
    const existing = await this.settingsRepository.findOne({ where: { key } });

    const setting = existing
      ? Object.assign(existing, { value, updatedByUserId })
      : this.settingsRepository.create({ key, value, updatedByUserId });

    await this.settingsRepository.save(setting);
  }

  private async createAudit(
    user: AuthenticatedUser,
    action: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    await this.auditRepository.save(
      this.auditRepository.create({
        action,
        actorUserId: user.id,
        actorName: user.name,
        context,
      }),
    );
  }
}
