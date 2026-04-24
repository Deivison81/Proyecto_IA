import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TICKET_PRIORITIES } from '../../../../domain/tickets/ticket-priority.type';
import type { TicketPriority } from '../../../../domain/tickets/ticket-priority.type';

export class AssignTicketRequestDto {
  @ApiProperty({ example: 'tecnico@proyectoia.local' })
  @IsEmail()
  technicianEmail!: string;

  @ApiProperty({
    example: 'Caso priorizado y asignado al equipo tecnico para gestion.',
  })
  @IsString()
  @MinLength(8)
  note!: string;

  @ApiProperty({ required: false, enum: TICKET_PRIORITIES, example: 'Alta' })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES)
  priority?: TicketPriority;
}
