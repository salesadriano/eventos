import { createHmac } from "node:crypto";

export class TokenHashService {
  constructor(private readonly secret: string) {}

  hashToken(token: string): string {
    return createHmac("sha256", this.secret).update(token).digest("hex");
  }
}
