import { createHash } from "crypto";
import {
  UserEntity,
  type OAuthProvider,
} from "../../../domain/entities/UserEntity";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { OAuthStateStore } from "../../../infrastructure/auth/OAuthStateStore";
import { TokenHashService } from "../../../infrastructure/auth/TokenHashService";
import { OAuthProviderRegistry } from "../../../infrastructure/auth/providers/OAuthProviderRegistry";
import { UserDtoMapper } from "../../dtos/UserDtos";

export interface OAuthCallbackRequest {
  provider: OAuthProvider;
  state: string;
  code: string;
  codeVerifier: string;
  redirectUri?: string;
}

export interface OAuthCallbackResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile: string;
  };
}

const createCodeChallenge = (codeVerifier: string): string =>
  createHash("sha256").update(codeVerifier).digest("base64url");

const createDefaultName = (email: string): string => {
  const [localPart] = email.split("@");
  return localPart || "OAuth User";
};

export class OAuthCallbackUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly providerRegistry: OAuthProviderRegistry,
    private readonly oauthStateStore: OAuthStateStore,
    private readonly jwtService: JwtService,
    private readonly tokenHashService: TokenHashService,
  ) {}

  async execute(request: OAuthCallbackRequest): Promise<OAuthCallbackResponse> {
    const stateContext = this.oauthStateStore.consume(
      request.state,
      request.provider,
    );

    const expectedCodeChallenge = stateContext.codeChallenge;
    const calculatedCodeChallenge = createCodeChallenge(request.codeVerifier);

    if (calculatedCodeChallenge !== expectedCodeChallenge) {
      throw new UnauthorizedError("Invalid PKCE code_verifier");
    }

    const provider = this.providerRegistry.getProvider(request.provider);
    const profile = await provider.exchangeCodeForProfile({
      code: request.code,
      codeVerifier: request.codeVerifier,
      redirectUri: request.redirectUri || stateContext.redirectUri,
    });

    if (!profile.email) {
      throw new ValidationError("OAuth profile did not provide an email");
    }

    let user = await this.userRepository.findByOAuthIdentity(
      request.provider,
      profile.subject,
    );

    if (!user) {
      const existingByEmail = await this.userRepository.findByEmail(
        profile.email,
      );

      if (existingByEmail) {
        user = await this.userRepository.update(
          existingByEmail.id,
          new UserEntity({
            ...existingByEmail.toPrimitives(),
            oauthProvider: request.provider,
            oauthSubject: profile.subject,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          }),
        );
      } else {
        user = await this.userRepository.create(
          UserEntity.create({
            name: profile.name || createDefaultName(profile.email),
            email: profile.email,
            oauthProvider: request.provider,
            oauthSubject: profile.subject,
            lastLoginAt: new Date(),
            profile: "user",
          }),
        );
      }
    }

    const tokenPair = this.jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      profile: user.profile,
    });

    const updatedUser = new UserEntity({
      ...user.toPrimitives(),
      refreshTokenHash: this.tokenHashService.hashToken(tokenPair.refreshToken),
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.update(user.id, updatedUser);

    const userDto = UserDtoMapper.toResponse(updatedUser);

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: userDto.id,
        name: userDto.name,
        email: userDto.email,
        profile: userDto.profile,
      },
    };
  }
}
