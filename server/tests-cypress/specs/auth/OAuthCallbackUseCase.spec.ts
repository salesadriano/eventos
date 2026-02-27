import { expect } from "chai";
import { createHash } from "crypto";
import { OAuthCallbackUseCase } from "../../../src/application/usecases/auth/OAuthCallbackUseCase";
import { UnauthorizedError } from "../../../src/domain/errors/ApplicationError";
import { JwtService } from "../../../src/infrastructure/auth/JwtService";
import { OAuthStateStore } from "../../../src/infrastructure/auth/OAuthStateStore";
import { TokenHashService } from "../../../src/infrastructure/auth/TokenHashService";
import { OAuthProviderRegistry } from "../../../src/infrastructure/auth/providers/OAuthProviderRegistry";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "../../../src/infrastructure/auth/providers/OAuthProviderClient";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
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
    return {
      subject: "oauth-subject-1",
      email: "oauth.user@example.com",
      name: "OAuth User",
      emailVerified: true,
    };
  }
}

const setup = () => {
  const userRepository = new UserRepositoryStub();
  userRepository.createMock.implement(async (user) => user);
  userRepository.updateMock.implement(async (_id, user) => user);
  const oauthStateStore = new OAuthStateStore(120);
  const providerRegistry = new OAuthProviderRegistry(
    new Map<string, OAuthProviderClient>([["google", new OAuthProviderStub()]])
  );
  const jwtService = new JwtService({
    secret: "test-secret",
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
  });
  const tokenHashService = new TokenHashService("test-secret");

  const useCase = new OAuthCallbackUseCase(
    userRepository,
    providerRegistry,
    oauthStateStore,
    jwtService,
    tokenHashService
  );

  return { useCase, userRepository, oauthStateStore };
};

export const oauthCallbackUseCaseSpecs = {
  async createsSessionWhenCallbackIsValid(): Promise<void> {
    const { useCase, userRepository, oauthStateStore } = setup();

    const codeVerifier = "1234567890123456789012345678901234567890123";
    const codeChallenge = createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    const context = oauthStateStore.create(
      "google",
      codeChallenge,
      "http://localhost:5173/callback"
    );

    const response = await useCase.execute({
      provider: "google",
      state: context.state,
      code: "oauth-code",
      codeVerifier,
    });

    expect(response.accessToken).to.be.a("string");
    expect(response.refreshToken).to.be.a("string");
    expect(response.user.email).to.equal("oauth.user@example.com");
    expect(userRepository.createMock.callCount).to.equal(1);
    expect(userRepository.updateMock.callCount).to.equal(1);
  },

  async throwsWhenStateIsReplayed(): Promise<void> {
    const { useCase, oauthStateStore } = setup();

    const codeVerifier = "1234567890123456789012345678901234567890123";
    const codeChallenge = createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    const context = oauthStateStore.create(
      "google",
      codeChallenge,
      "http://localhost:5173/callback"
    );

    await useCase.execute({
      provider: "google",
      state: context.state,
      code: "oauth-code",
      codeVerifier,
    });

    await expectAsyncError(
      () =>
        useCase.execute({
          provider: "google",
          state: context.state,
          code: "oauth-code",
          codeVerifier,
        }),
      UnauthorizedError
    );
  },

  async throwsWhenPkceVerifierIsInvalid(): Promise<void> {
    const { useCase, oauthStateStore } = setup();

    const context = oauthStateStore.create(
      "google",
      "invalid-challenge-base64url",
      "http://localhost:5173/callback"
    );

    await expectAsyncError(
      () =>
        useCase.execute({
          provider: "google",
          state: context.state,
          code: "oauth-code",
          codeVerifier: "1234567890123456789012345678901234567890123",
        }),
      UnauthorizedError
    );
  },
};
