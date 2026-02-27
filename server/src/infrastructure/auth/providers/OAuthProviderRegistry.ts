import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { OAuthProviderClient } from "./OAuthProviderClient";

export class OAuthProviderRegistry {
  constructor(private readonly providers: Map<string, OAuthProviderClient>) {}

  listEnabledProviders(): Array<{ provider: string; displayName: string }> {
    return Array.from(this.providers.values()).map((provider) => ({
      provider: provider.provider,
      displayName: provider.displayName,
    }));
  }

  getProvider(provider: string): OAuthProviderClient {
    const client = this.providers.get(provider);

    if (!client) {
      throw new ValidationError(`OAuth provider ${provider} is not enabled`);
    }

    return client;
  }
}
