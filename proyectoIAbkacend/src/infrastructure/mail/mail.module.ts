import { Module } from '@nestjs/common';
import { NotificationService } from '../../application/notifications/notification.service';
import { MAIL_SERVICE } from '../../domain/notifications/mail-service.port';
import { SmtpMailService } from './smtp-mail.service';

@Module({
  providers: [
    NotificationService,
    SmtpMailService,
    {
      provide: MAIL_SERVICE,
      useExisting: SmtpMailService,
    },
  ],
  exports: [NotificationService],
})
export class MailModule {}
