import type { Email } from "../../../domain/entities/Email";
import { EmailEntity } from "../../../domain/entities/Email";
import type { IMailClient } from "../../../domain/repositories/IMailClient";

export class SendEmailUseCase {
  constructor(private readonly mailClient: IMailClient) {}

  async execute(emailData: Email): Promise<void> {
    const email = new EmailEntity(
      emailData.to,
      emailData.subject,
      emailData.text,
      emailData.html,
      emailData.cc,
      emailData.bcc,
      emailData.attachments
    );

    await this.mailClient.send(email);
  }
}

