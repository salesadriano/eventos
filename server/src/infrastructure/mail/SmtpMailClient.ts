import nodemailer, { type Transporter } from "nodemailer";
import type { Email } from "../../domain/entities/Email";
import type { IMailClient } from "../../domain/repositories/IMailClient";
import type { ISmtpConfig } from "../../domain/repositories/ISmtpConfig";

export class SmtpMailClient implements IMailClient {
  private transporter: Transporter;

  constructor(private readonly config: ISmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
  }

  async send(email: Email): Promise<void> {
    try {
      const mailOptions = {
        from: this.config.from || this.config.auth.user,
        to: Array.isArray(email.to) ? email.to.join(", ") : email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
        cc: email.cc
          ? Array.isArray(email.cc)
            ? email.cc.join(", ")
            : email.cc
          : undefined,
        bcc: email.bcc
          ? Array.isArray(email.bcc)
            ? email.bcc.join(", ")
            : email.bcc
          : undefined,
        attachments: email.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Log success (in production, use proper logging)
      console.log("Email sent successfully:", info.messageId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}
