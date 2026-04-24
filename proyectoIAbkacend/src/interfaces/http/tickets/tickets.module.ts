import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from '../../../application/tickets/tickets.service';
import { TICKET_REPOSITORY } from '../../../domain/tickets/ticket-repository.port';
import { USER_REPOSITORY } from '../../../domain/users/user-repository.port';
import { TicketEntity } from '../../../infrastructure/database/typeorm/entities/ticket.entity';
import { TicketUpdateEntity } from '../../../infrastructure/database/typeorm/entities/ticket-update.entity';
import { UserEntity } from '../../../infrastructure/database/typeorm/entities/user.entity';
import { MailModule } from '../../../infrastructure/mail/mail.module';
import { TypeormTicketRepository } from '../../../infrastructure/database/typeorm/repositories/typeorm-ticket.repository';
import { TypeormUserRepository } from '../../../infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([TicketEntity, TicketUpdateEntity, UserEntity]),
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    {
      provide: TICKET_REPOSITORY,
      useClass: TypeormTicketRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
