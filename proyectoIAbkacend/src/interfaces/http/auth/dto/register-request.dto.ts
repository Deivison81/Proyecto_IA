import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { USER_ROLES } from '../../../../domain/users/user-role.enum';
import type { UserRole } from '../../../../domain/users/user-role.enum';

export class RegisterRequestDto {
  @ApiProperty({ example: 'Laura Gomez' })
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({ example: 'usuario@empresa.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Demo1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: USER_ROLES, example: 'client' })
  @IsIn(USER_ROLES)
  role!: UserRole;
}
