import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'usuario@empresa.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Demo1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
