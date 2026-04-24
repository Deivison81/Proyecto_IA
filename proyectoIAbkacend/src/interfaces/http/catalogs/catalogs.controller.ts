import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogsService } from '../../../application/catalogs/catalogs.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { ToggleCatalogItemRequestDto } from './dto/toggle-catalog-item-request.dto';
import { UpdatePlatformSettingsRequestDto } from './dto/update-platform-settings-request.dto';
import { UpsertCatalogItemRequestDto } from './dto/upsert-catalog-item-request.dto';

@ApiTags('Catalogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('catalogs')
  @Version('1')
  @ApiOperation({ summary: 'Consulta catalogos globales de la plataforma' })
  getCatalogs() {
    return this.catalogsService.getCatalogs();
  }

  @Get('platform/settings')
  @Version('1')
  @ApiOperation({ summary: 'Consulta parametros globales de plataforma' })
  getPlatformSettings() {
    return this.catalogsService.getPlatformSettings();
  }

  @Patch('platform/settings')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('platform_admin')
  @ApiOperation({ summary: 'Actualiza parametros globales de plataforma' })
  updatePlatformSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePlatformSettingsRequestDto,
  ) {
    return this.catalogsService.updatePlatformSettings(user, dto);
  }

  @Post('catalogs/items')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('platform_admin', 'administrative')
  @ApiOperation({ summary: 'Crea o actualiza item de catalogo' })
  upsertCatalogItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertCatalogItemRequestDto,
  ) {
    return this.catalogsService.upsertCatalogItem(user, dto);
  }

  @Patch('catalogs/items/:itemId')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('platform_admin', 'administrative')
  @ApiOperation({ summary: 'Activa o desactiva item de catalogo' })
  toggleCatalogItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
    @Body() dto: ToggleCatalogItemRequestDto,
  ) {
    return this.catalogsService.toggleCatalogItem(user, itemId, dto.isActive);
  }

  @Get('platform/audit')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('platform_admin')
  @ApiOperation({ summary: 'Consulta auditoria de cambios de plataforma' })
  listAuditLogs() {
    return this.catalogsService.listAuditLogs();
  }
}
