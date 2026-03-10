import { StartOAuthAuthorizationUseCase } from "../../../src/application/usecases/auth/StartOAuthAuthorizationUseCase";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { OAuthStateStore } from "../../../src/infrastructure/auth/OAuthStateStore";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "../../../src/infrastructure/auth/providers/OAuthProviderClient";
import { OAuthProviderRegistry } from "../../../src/infrastructure/auth/providers/OAuthProviderRegistry";
import { expectAsyncError } from "../utils/expectError";

class OAuthProviderStub implements OAuthProviderClient {
  readonly provider = "google";
  readonly displayName = "Google";

  getDefaultRedirectUri(): string {
    return "http://localhost:5173/callback";
  }

  getAuthorizationUrl(_params: OAuthAuthorizationParams): string {
    return "https://accounts.google.com/o/oauth2/v2/auth";
  }

  async exchangeCodeForProfile(
    _params: OAuthCodeExchangeParams,
  ): Promise<OAuthProviderProfile> {
    throw new Error("not implemented");
  }
}

const createUseCase = (): StartOAuthAuthorizationUseCase => {
  const registry = new OAuthProviderRegistry(
    new Map<string, OAuthProviderClient>([["google", new OAuthProviderStub()]]),
  );
  const stateStore = new OAuthStateStore(60);
  return new StartOAuthAuthorizationUseCase(registry, stateStore);
};

describe("StartOAuthAuthorizationUseCase (migrated from tests-cypress)", () => {
  it("returnsAuthorizationUrlWithState", () => {
    const useCase = createUseCase();

    const result = useCase.execute({
      provider: "google",
      codeChallenge: "1234567890123456789012345678901234567890123",
    });

    expect(result.provider).toBe("google");
    expect(result.state).toEqual(expect.any(String));
    expect(result.authorizationUrl).toContain("https://accounts.google.com");
  });

  it("throwsWhenCodeChallengeIsInvalid", async () => {
    const useCase = createUseCase();

    await expectAsyncError(
      async () => {
        useCase.execute({
          provider: "google",
          codeChallenge: "short",
        });
      },
      ValidationError,
    );
  });
});
