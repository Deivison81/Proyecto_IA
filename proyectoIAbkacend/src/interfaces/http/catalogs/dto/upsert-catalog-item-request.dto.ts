import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CATALOG_CATEGORIES } from '../../../../infrastructure/database/typeorm/entities/catalog-item.entity';
import type { CatalogCategory } from '../../../../infrastructure/database/typeorm/entities/catalog-item.entity';

export class UpsertCatalogItemRequestDto {
  @ApiProperty({ enum: CATALOG_CATEGORIES, example: 'service' })
  @IsIn(CATALOG_CATEGORIES)
  category!: CatalogCategory;

  @ApiProperty({ example: 'Soporte de impresoras' })
  @IsString()
  @MinLength(3)
  value!: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
