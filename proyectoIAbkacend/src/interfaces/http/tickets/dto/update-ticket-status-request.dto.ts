import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';
import { TICKET_STATUSES } from '../../../../domain/tickets/ticket-status.type';
import type { TicketStatus } from '../../../../domain/tickets/ticket-status.type';

export class UpdateTicketStatusRequestDto {
  @ApiProperty({ enum: TICKET_STATUSES, example: 'En proceso' })
  @IsIn(TICKET_STATUSES)
  status!: TicketStatus;

  @ApiProperty({
    example: 'Se inicia diagnostico de conectividad y servicios.',
  })
  @IsString()
  @MinLength(8)
  note!: string;
}
