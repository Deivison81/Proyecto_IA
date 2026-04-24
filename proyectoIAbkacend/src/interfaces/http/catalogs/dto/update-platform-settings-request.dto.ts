import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePlatformSettingsRequestDto {
  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  allowClientRegistration?: boolean;

  @ApiProperty({ required: false, example: 8, minimum: 1, maximum: 168 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168)
  slaHours?: number;
}
