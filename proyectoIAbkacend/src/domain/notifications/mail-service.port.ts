export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailServicePort {
  send(message: MailMessage): Promise<void>;
}
