import { ValidationError } from "../../../domain/errors/ApplicationError";
import { OAuthStateStore } from "../../../infrastructure/auth/OAuthStateStore";
import { OAuthProviderRegistry } from "../../../infrastructure/auth/providers/OAuthProviderRegistry";

export interface StartOAuthAuthorizationRequest {
  provider: string;
  codeChallenge: string;
  redirectUri?: string;
}

export interface StartOAuthAuthorizationResponse {
  provider: string;
  state: string;
  authorizationUrl: string;
  expiresAt: string;
}

const isValidCodeChallenge = (value: string): boolean =>
  /^[A-Za-z0-9\-._~]{43,128}$/.test(value);

export class StartOAuthAuthorizationUseCase {
  constructor(
    private readonly providerRegistry: OAuthProviderRegistry,
    private readonly oauthStateStore: OAuthStateStore
  ) {}

  execute(
    request: StartOAuthAuthorizationRequest
  ): StartOAuthAuthorizationResponse {
    if (!isValidCodeChallenge(request.codeChallenge)) {
      throw new ValidationError("Invalid PKCE code_challenge");
    }

    const provider = this.providerRegistry.getProvider(request.provider);
    const redirectUri = request.redirectUri || provider.getDefaultRedirectUri();

    if (!redirectUri) {
      throw new ValidationError("OAuth redirect URI is required");
    }

    const stateContext = this.oauthStateStore.create(
      request.provider,
      request.codeChallenge,
      redirectUri
    );

    return {
      provider: request.provider,
      state: stateContext.state,
      authorizationUrl: provider.getAuthorizationUrl({
        state: stateContext.state,
        codeChallenge: request.codeChallenge,
        redirectUri,
      }),
      expiresAt: stateContext.expiresAt.toISOString(),
    };
  }
}
