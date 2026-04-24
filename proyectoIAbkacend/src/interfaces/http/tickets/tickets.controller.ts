import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketsService } from '../../../application/tickets/tickets.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { AddTicketNoteRequestDto } from './dto/add-ticket-note-request.dto';
import { AssignTicketRequestDto } from './dto/assign-ticket-request.dto';
import { CreateTicketRequestDto } from './dto/create-ticket-request.dto';
import { UpdateTicketStatusRequestDto } from './dto/update-ticket-status-request.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Crea un ticket cliente o interno' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTicketRequestDto,
  ) {
    return this.ticketsService.create(user, dto);
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Lista tickets visibles segun rol del usuario' })
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.ticketsService.list(user);
  }

  @Patch(':ticketId/assign')
  @Version('1')
  @ApiOperation({ summary: 'Asigna ticket a tecnico (admin/plat admin)' })
  assign(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ticketId') ticketId: string,
    @Body() dto: AssignTicketRequestDto,
  ) {
    return this.ticketsService.assign(user, ticketId, dto);
  }

  @Patch(':ticketId/status')
  @Version('1')
  @ApiOperation({ summary: 'Actualiza estado y agrega nota de seguimiento' })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketStatusRequestDto,
  ) {
    return this.ticketsService.updateStatus(user, ticketId, dto);
  }

  @Post(':ticketId/notes')
  @Version('1')
  @ApiOperation({ summary: 'Agrega nota de seguimiento al ticket' })
  addNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ticketId') ticketId: string,
    @Body() dto: AddTicketNoteRequestDto,
  ) {
    return this.ticketsService.addNote(user, ticketId, dto);
  }
}
