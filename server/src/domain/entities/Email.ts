export interface Email {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content?: string;
  path?: string;
  contentType?: string;
}

export class EmailEntity {
  constructor(
    public readonly to: string | string[],
    public readonly subject: string,
    public readonly text?: string,
    public readonly html?: string,
    public readonly cc?: string | string[],
    public readonly bcc?: string | string[],
    public readonly attachments?: EmailAttachment[]
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.to || (Array.isArray(this.to) && this.to.length === 0)) {
      throw new Error("Email recipient (to) is required");
    }

    if (!this.subject || this.subject.trim().length === 0) {
      throw new Error("Email subject is required");
    }

    if (!this.text && !this.html) {
      throw new Error("Email must have either text or html content");
    }

    // Validate email addresses
    const recipients = Array.isArray(this.to) ? this.to : [this.to];
    recipients.forEach((email) => {
      if (!this.isValidEmail(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

