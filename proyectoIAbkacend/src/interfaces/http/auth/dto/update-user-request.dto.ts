import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { USER_ROLES } from '../../../../domain/users/user-role.enum';
import type { UserRole } from '../../../../domain/users/user-role.enum';

export class UpdateUserRequestDto {
  @ApiProperty({ required: false, enum: USER_ROLES, example: 'technician' })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}