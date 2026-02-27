import { OAuthProviderRegistry } from "../../../infrastructure/auth/providers/OAuthProviderRegistry";

export class ListOAuthProvidersUseCase {
  constructor(private readonly providerRegistry: OAuthProviderRegistry) {}

  execute(): Array<{ provider: string; displayName: string }> {
    return this.providerRegistry.listEnabledProviders();
  }
}
