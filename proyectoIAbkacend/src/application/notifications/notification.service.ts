import { Inject, Injectable, Logger } from '@nestjs/common';
import { MAIL_SERVICE } from '../../domain/notifications/mail-service.port';
import type { MailServicePort } from '../../domain/notifications/mail-service.port';
import {
  buildRegistrationTemplate,
  buildTicketAssignmentTemplate,
  buildTicketClosureTemplate,
} from '../../infrastructure/mail/templates/mail-templates';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(MAIL_SERVICE)
    private readonly mailService: MailServicePort,
  ) {}

  async sendRegistrationEmail(
    email: string,
    name: string,
    role: string,
  ): Promise<void> {
    const template = buildRegistrationTemplate({ name, role });

    await this.safeSend(email, template.subject, template.text, template.html);
  }

  async sendTicketAssignmentEmail(
    email: string,
    name: string,
    ticketCode: string,
    ticketTitle: string,
    assignedBy: string,
  ): Promise<void> {
    const template = buildTicketAssignmentTemplate({
      name,
      ticketCode,
      ticketTitle,
      assignedBy,
    });

    await this.safeSend(email, template.subject, template.text, template.html);
  }

  async sendTicketClosureEmail(
    email: string,
    name: string,
    ticketCode: string,
    ticketTitle: string,
    closedBy: string,
  ): Promise<void> {
    const template = buildTicketClosureTemplate({
      name,
      ticketCode,
      ticketTitle,
      closedBy,
    });

    await this.safeSend(email, template.subject, template.text, template.html);
  }

  private async safeSend(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    try {
      await this.mailService.send({ to, subject, text, html });
    } catch (error) {
      this.logger.warn(
        `No fue posible enviar correo a ${to}: ${String(error)}`,
      );
    }
  }
}
