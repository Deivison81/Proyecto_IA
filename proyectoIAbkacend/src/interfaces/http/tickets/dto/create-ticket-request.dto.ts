import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TICKET_PRIORITIES } from '../../../../domain/tickets/ticket-priority.type';
import type { TicketPriority } from '../../../../domain/tickets/ticket-priority.type';

export class CreateTicketRequestDto {
  @ApiProperty({ example: 'Servidor sin acceso desde contabilidad' })
  @IsString()
  @MinLength(6)
  title!: string;

  @ApiProperty({ example: 'Manejo de servidores' })
  @IsString()
  @MinLength(3)
  service!: string;

  @ApiProperty({ enum: TICKET_PRIORITIES, example: 'Alta' })
  @IsIn(TICKET_PRIORITIES)
  priority!: TicketPriority;

  @ApiProperty({
    example:
      'Usuarios no pueden abrir carpetas compartidas desde las 7:30 a.m.',
  })
  @IsString()
  @MinLength(12)
  description!: string;

  @ApiProperty({
    required: false,
    example: 'Captura de error y log del sistema',
  })
  @IsOptional()
  @IsString()
  evidence?: string;

  @ApiProperty({
    required: false,
    example: 'Pendiente de revision de permisos SMB',
  })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ required: false, example: 'Comercial Nova' })
  @IsOptional()
  @IsString()
  clientName?: string;
}
