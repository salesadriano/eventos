import type { Email } from "../entities/Email";

export interface IMailClient {
  send(email: Email): Promise<void>;
}

