import { randomUUID } from "node:crypto";
import { UnauthorizedError } from "../../domain/errors/ApplicationError";

export interface OAuthStateContext {
  state: string;
  provider: string;
  codeChallenge: string;
  redirectUri: string;
  expiresAt: Date;
}

export class OAuthStateStore {
  private readonly states = new Map<string, OAuthStateContext>();

  constructor(private readonly ttlInSeconds: number) {}

  create(provider: string, codeChallenge: string, redirectUri: string): OAuthStateContext {
    const state = randomUUID();
    const expiresAt = new Date(Date.now() + this.ttlInSeconds * 1000);

    const context: OAuthStateContext = {
      state,
      provider,
      codeChallenge,
      redirectUri,
      expiresAt,
    };

    this.states.set(state, context);
    return context;
  }

  consume(state: string, provider: string): OAuthStateContext {
    const context = this.states.get(state);
    this.states.delete(state);

    if (!context) {
      throw new UnauthorizedError("Invalid OAuth state");
    }

    if (context.provider !== provider) {
      throw new UnauthorizedError("OAuth provider mismatch for state");
    }

    if (context.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedError("OAuth state expired");
    }

    return context;
  }
}
