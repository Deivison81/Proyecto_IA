import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsService } from '../../../application/catalogs/catalogs.service';
import { AuditLogEntity } from '../../../infrastructure/database/typeorm/entities/audit-log.entity';
import { CatalogItemEntity } from '../../../infrastructure/database/typeorm/entities/catalog-item.entity';
import { PlatformSettingEntity } from '../../../infrastructure/database/typeorm/entities/platform-setting.entity';
import { CatalogsController } from './catalogs.controller';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatalogItemEntity,
      PlatformSettingEntity,
      AuditLogEntity,
    ]),
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService, RolesGuard],
  exports: [CatalogsService],
})
export class CatalogsModule {}
