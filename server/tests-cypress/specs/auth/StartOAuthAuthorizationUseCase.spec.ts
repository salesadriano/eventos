import { expect } from "chai";
import { StartOAuthAuthorizationUseCase } from "../../../src/application/usecases/auth/StartOAuthAuthorizationUseCase";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { OAuthStateStore } from "../../../src/infrastructure/auth/OAuthStateStore";
import { OAuthProviderRegistry } from "../../../src/infrastructure/auth/providers/OAuthProviderRegistry";
import type { OAuthProviderClient } from "../../../src/infrastructure/auth/providers/OAuthProviderClient";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderProfile,
} from "../../../src/infrastructure/auth/providers/OAuthProviderClient";
import { expectAsyncError } from "../../utils/expectError";

class OAuthProviderStub implements OAuthProviderClient {
  readonly provider = "google";
  readonly displayName = "Google";

  getDefaultRedirectUri(): string {
    return "http://localhost:5173/callback";
  }

  getAuthorizationUrl(_params: OAuthAuthorizationParams): string {
    void _params;
    return "https://accounts.google.com/o/oauth2/v2/auth";
  }

  async exchangeCodeForProfile(
    _params: OAuthCodeExchangeParams
  ): Promise<OAuthProviderProfile> {
    void _params;
    throw new Error("not implemented");
  }
}

const createUseCase = (): StartOAuthAuthorizationUseCase => {
  const registry = new OAuthProviderRegistry(
    new Map<string, OAuthProviderClient>([["google", new OAuthProviderStub()]])
  );
  const stateStore = new OAuthStateStore(60);
  return new StartOAuthAuthorizationUseCase(registry, stateStore);
};

export const startOAuthAuthorizationUseCaseSpecs = {
  async returnsAuthorizationUrlWithState(): Promise<void> {
    const useCase = createUseCase();

    const result = useCase.execute({
      provider: "google",
      codeChallenge: "1234567890123456789012345678901234567890123",
    });

    expect(result.provider).to.equal("google");
    expect(result.state).to.be.a("string");
    expect(result.authorizationUrl).to.contain("https://accounts.google.com");
  },

  async throwsWhenCodeChallengeIsInvalid(): Promise<void> {
    const useCase = createUseCase();

    await expectAsyncError(
      async () => {
        useCase.execute({
          provider: "google",
          codeChallenge: "short",
        });
      },
      ValidationError
    );
  },
};
