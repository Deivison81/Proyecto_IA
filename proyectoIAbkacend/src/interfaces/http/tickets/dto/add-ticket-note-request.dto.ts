import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddTicketNoteRequestDto {
  @ApiProperty({
    example: 'Se adjunta evidencia adicional para el seguimiento.',
  })
  @IsString()
  @MinLength(8)
  note!: string;
}
