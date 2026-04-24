import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleCatalogItemRequestDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive!: boolean;
}
