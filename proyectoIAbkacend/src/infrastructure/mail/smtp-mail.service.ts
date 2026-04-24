import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import type {
  MailMessage,
  MailServicePort,
} from '../../domain/notifications/mail-service.port';

@Injectable()
export class SmtpMailService implements MailServicePort {
  private readonly logger = new Logger(SmtpMailService.name);
  private readonly enabled: boolean;
  private readonly from: string;
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.enabled =
      this.configService.get<string>('MAIL_ENABLED', 'false').toLowerCase() ===
      'true';
    this.from = this.configService.get<string>(
      'MAIL_FROM',
      'noreply@proyectoia.local',
    );

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'localhost'),
      port: Number(this.configService.get<string>('SMTP_PORT', '1025')),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  async send(message: MailMessage): Promise<void> {
    if (!this.enabled) {
      this.logger.log(
        `MAIL_ENABLED=false. Correo simulado para ${message.to}: ${message.subject}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }
}
