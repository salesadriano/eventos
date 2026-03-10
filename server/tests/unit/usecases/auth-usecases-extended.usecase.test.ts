import { createHash } from "crypto";
import { ListOAuthProvidersUseCase } from "../../../src/application/usecases/auth/ListOAuthProvidersUseCase";
import { LoginUseCase } from "../../../src/application/usecases/auth/LoginUseCase";
import { LogoutUseCase } from "../../../src/application/usecases/auth/LogoutUseCase";
import { OAuthCallbackUseCase } from "../../../src/application/usecases/auth/OAuthCallbackUseCase";
import { RevokeRefreshTokenUseCase } from "../../../src/application/usecases/auth/RevokeRefreshTokenUseCase";
import { ValidateTokenUseCase } from "../../../src/application/usecases/auth/ValidateTokenUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../src/domain/errors/ApplicationError";
import { JwtService } from "../../../src/infrastructure/auth/JwtService";
import { OAuthStateStore } from "../../../src/infrastructure/auth/OAuthStateStore";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "../../../src/infrastructure/auth/providers/OAuthProviderClient";
import { OAuthProviderRegistry } from "../../../src/infrastructure/auth/providers/OAuthProviderRegistry";
import { TokenHashService } from "../../../src/infrastructure/auth/TokenHashService";
import { FederatedIdentityRepositoryStub } from "../../../tests-cypress/stubs/FederatedIdentityRepositoryStub";
import { PasswordServiceStub } from "../../../tests-cypress/stubs/PasswordServiceStub";
import { UserRepositoryStub } from "../../../tests-cypress/stubs/UserRepositoryStub";
import { expectAsyncError } from "../utils/expectError";

const jwtService = new JwtService({
  secret: "test-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
});

const tokenHashService = new TokenHashService("test-secret");

class OAuthProviderStub implements OAuthProviderClient {
  readonly provider = "google";
  readonly displayName = "Google";

  constructor(private readonly profile: OAuthProviderProfile) {}

  getDefaultRedirectUri(): string {
    return "http://localhost:5173/auth/callback";
  }

  getAuthorizationUrl(_params: OAuthAuthorizationParams): string {
    return "https://accounts.google.com/o/oauth2/v2/auth";
  }

  async exchangeCodeForProfile(
    _params: OAuthCodeExchangeParams,
  ): Promise<OAuthProviderProfile> {
    return this.profile;
  }
}

const createCodeChallenge = (codeVerifier: string): string =>
  createHash("sha256").update(codeVerifier).digest("base64url");

const createBaseUser = (): UserEntity =>
  UserEntity.create({
    name: "Auth User",
    email: "auth.user@example.com",
    password: "hashed-password",
    profile: "user",
  });

describe("Auth use cases (extended coverage)", () => {
  it("logs in with valid credentials and persists refresh token hash", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const user = createBaseUser();

    repository.findByEmailMock.resolveWith(user);
    passwordService.compareMock.resolveWith(true);
    repository.updateMock.implement(async (_id, updatedUser) => updatedUser);

    const useCase = new LoginUseCase(
      repository,
      passwordService,
      jwtService,
      tokenHashService,
    );

    const result = await useCase.execute({
      email: user.email,
      password: "plain-password",
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user.email).toBe(user.email);
    expect(passwordService.compareMock.callCount).toBe(1);
    expect(repository.updateMock.callCount).toBe(1);

    const persistedUser = repository.updateMock.calls[0][1];
    expect(persistedUser.refreshTokenHash).toBe(
      tokenHashService.hashToken(result.refreshToken),
    );
  });

  it("rejects login when credentials are invalid or user has no password", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const useCase = new LoginUseCase(
      repository,
      passwordService,
      jwtService,
      tokenHashService,
    );

    repository.findByEmailMock.resolveWith(null);
    await expectAsyncError(
      () => useCase.execute({ email: "missing@example.com", password: "x" }),
      ValidationError,
    );

    repository.findByEmailMock.resolveWith(
      UserEntity.create({
        name: "OAuth-only",
        email: "oauth.only@example.com",
        profile: "user",
      }),
    );

    await expectAsyncError(
      () => useCase.execute({ email: "oauth.only@example.com", password: "x" }),
      ValidationError,
    );

    repository.findByEmailMock.resolveWith(createBaseUser());
    passwordService.compareMock.resolveWith(false);

    await expectAsyncError(
      () =>
        useCase.execute({
          email: "auth.user@example.com",
          password: "wrong-password",
        }),
      ValidationError,
    );
  });

  it("validates access token against repository user existence", async () => {
    const repository = new UserRepositoryStub();
    const user = createBaseUser();
    repository.findByIdMock.resolveWith(user);

    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
      profile: user.profile,
    });

    const useCase = new ValidateTokenUseCase(repository, jwtService);
    const validResult = await useCase.execute(accessToken);
    expect(validResult).toMatchObject({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });

    repository.findByIdMock.resolveWith(null);
    const missingUserResult = await useCase.execute(accessToken);
    expect(missingUserResult).toEqual({ valid: false });

    const invalidTokenResult = await useCase.execute("invalid-token");
    expect(invalidTokenResult).toEqual({ valid: false });
  });

  it("logs out user by revoking stored refresh token hash", async () => {
    const repository = new UserRepositoryStub();
    const tokenPair = jwtService.generateTokenPair({
      userId: "user-1",
      email: "logout.user@example.com",
      profile: "user",
    });

    const user = new UserEntity({
      ...createBaseUser().toPrimitives(),
      id: "user-1",
      email: "logout.user@example.com",
      refreshTokenHash: tokenHashService.hashToken(tokenPair.refreshToken),
    });

    repository.findByIdMock.resolveWith(user);
    repository.updateMock.implement(async (_id, updatedUser) => updatedUser);

    const useCase = new LogoutUseCase(repository);
    await useCase.execute(user.id);

    expect(repository.updateMock.callCount).toBe(1);
    expect(repository.updateMock.calls[0][1].refreshTokenHash).toBeUndefined();

    await expectAsyncError(() => useCase.execute(""), ValidationError);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing-user"), ValidationError);
  });

  it("revokes refresh token when token belongs to current user", async () => {
    const repository = new UserRepositoryStub();
    const tokenPair = jwtService.generateTokenPair({
      userId: "user-2",
      email: "revoke.user@example.com",
      profile: "user",
    });

    const persistedUser = new UserEntity({
      ...createBaseUser().toPrimitives(),
      id: "user-2",
      email: "revoke.user@example.com",
      refreshTokenHash: tokenHashService.hashToken(tokenPair.refreshToken),
    });

    repository.findByIdMock.resolveWith(persistedUser);
    repository.updateMock.implement(async (_id, updatedUser) => updatedUser);

    const useCase = new RevokeRefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService,
    );

    await useCase.execute("user-2", tokenPair.refreshToken);
    expect(repository.updateMock.callCount).toBe(1);
    expect(repository.updateMock.calls[0][1].refreshTokenHash).toBeUndefined();

    await expectAsyncError(
      () => useCase.execute("", tokenPair.refreshToken),
      ValidationError,
    );

    await expectAsyncError(
      () => useCase.execute("user-2", ""),
      ValidationError,
    );

    await expectAsyncError(
      () => useCase.execute("user-2", "invalid-refresh-token"),
      UnauthorizedError,
    );

    repository.findByIdMock.resolveWith(
      new UserEntity({
        ...persistedUser.toPrimitives(),
        refreshTokenHash: tokenHashService.hashToken("another-refresh-token"),
      }),
    );

    await expectAsyncError(
      () => useCase.execute("user-2", tokenPair.refreshToken),
      UnauthorizedError,
    );
  });

  it("lists enabled OAuth providers", () => {
    const useCase = new ListOAuthProvidersUseCase(
      new OAuthProviderRegistry(
        new Map<string, OAuthProviderClient>([
          [
            "google",
            new OAuthProviderStub({
              subject: "subject-1",
              email: "oauth@example.com",
              name: "OAuth User",
              emailVerified: true,
            }),
          ],
        ]),
      ),
    );

    expect(useCase.execute()).toEqual([
      { provider: "google", displayName: "Google" },
    ]);
  });

  it("creates OAuth user session and rejects replayed state", async () => {
    const userRepository = new UserRepositoryStub();
    const federatedIdentityRepository = new FederatedIdentityRepositoryStub();
    const oauthStateStore = new OAuthStateStore(60);
    const codeVerifier = "verifier-1234567890123456789012345678901234567890";
    const codeChallenge = createCodeChallenge(codeVerifier);
    const stateContext = oauthStateStore.create(
      "google",
      codeChallenge,
      "http://localhost:5173/auth/callback",
    );

    const provider = new OAuthProviderStub({
      subject: "google-subject-1",
      email: "oauth.new@example.com",
      name: "OAuth New User",
      emailVerified: true,
    });

    const registry = new OAuthProviderRegistry(
      new Map<string, OAuthProviderClient>([["google", provider]]),
    );

    userRepository.findByOAuthIdentityMock.resolveWith(null);
    userRepository.findByEmailMock.resolveWith(null);
    userRepository.createMock.implement(async (user) => user);
    userRepository.updateMock.implement(async (_id, user) => user);
    federatedIdentityRepository.findByProviderAndSubjectMock.resolveWith(null);
    federatedIdentityRepository.createMock.implement(async (identity) => identity);

    const useCase = new OAuthCallbackUseCase(
      userRepository,
      federatedIdentityRepository,
      registry,
      oauthStateStore,
      jwtService,
      tokenHashService,
    );

    const response = await useCase.execute({
      provider: "google",
      state: stateContext.state,
      code: "oauth-code",
      codeVerifier,
    });

    expect(response.accessToken).toEqual(expect.any(String));
    expect(response.refreshToken).toEqual(expect.any(String));
    expect(response.user.email).toBe("oauth.new@example.com");
    expect(userRepository.createMock.callCount).toBe(1);
    expect(federatedIdentityRepository.createMock.callCount).toBe(1);

    await expectAsyncError(
      () =>
        useCase.execute({
          provider: "google",
          state: stateContext.state,
          code: "oauth-code",
          codeVerifier,
        }),
      UnauthorizedError,
    );
  });

  it("rejects OAuth callback when PKCE verifier is invalid or profile email is missing", async () => {
    const userRepository = new UserRepositoryStub();
    const federatedIdentityRepository = new FederatedIdentityRepositoryStub();
    const oauthStateStore = new OAuthStateStore(60);

    const validVerifier =
      "valid-verifier-123456789012345678901234567890123456789012";
    const validState = oauthStateStore.create(
      "google",
      createCodeChallenge(validVerifier),
      "http://localhost:5173/auth/callback",
    );

    const invalidPkceState = oauthStateStore.create(
      "google",
      createCodeChallenge("different-verifier"),
      "http://localhost:5173/auth/callback",
    );

    const registryMissingEmail = new OAuthProviderRegistry(
      new Map<string, OAuthProviderClient>([
        [
          "google",
          new OAuthProviderStub({
            subject: "subject-without-email",
            email: "",
            name: "No Email",
            emailVerified: false,
          }),
        ],
      ]),
    );

    const useCaseMissingEmail = new OAuthCallbackUseCase(
      userRepository,
      federatedIdentityRepository,
      registryMissingEmail,
      oauthStateStore,
      jwtService,
      tokenHashService,
    );

    await expectAsyncError(
      () =>
        useCaseMissingEmail.execute({
          provider: "google",
          state: invalidPkceState.state,
          code: "oauth-code",
          codeVerifier: validVerifier,
        }),
      UnauthorizedError,
    );

    await expectAsyncError(
      () =>
        useCaseMissingEmail.execute({
          provider: "google",
          state: validState.state,
          code: "oauth-code",
          codeVerifier: validVerifier,
        }),
      ValidationError,
    );
  });
});