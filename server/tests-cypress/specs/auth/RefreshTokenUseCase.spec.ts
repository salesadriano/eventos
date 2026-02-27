import { expect } from "chai";
import { RefreshTokenUseCase } from "../../../src/application/usecases/auth/RefreshTokenUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { UnauthorizedError } from "../../../src/domain/errors/ApplicationError";
import { JwtService } from "../../../src/infrastructure/auth/JwtService";
import { TokenHashService } from "../../../src/infrastructure/auth/TokenHashService";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

const jwtService = new JwtService({
  secret: "test-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
});
const tokenHashService = new TokenHashService("test-secret");

const baseUser = UserEntity.create({
  name: "OAuth User",
  email: "oauth.user@example.com",
  profile: "user",
});

export const refreshTokenUseCaseSpecs = {
  async rotatesRefreshTokenWhenCurrentTokenIsValid(): Promise<void> {
    const repository = new UserRepositoryStub();
    const initialPair = jwtService.generateTokenPair({
      userId: baseUser.id,
      email: baseUser.email,
      profile: baseUser.profile,
    });

    const persisted = new UserEntity({
      ...baseUser.toPrimitives(),
      refreshTokenHash: tokenHashService.hashToken(initialPair.refreshToken),
    });

    repository.findByIdMock.resolveWith(persisted);
    repository.updateMock.implement(async (_id, user) => user);

    const useCase = new RefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService
    );

    const result = await useCase.execute({ refreshToken: initialPair.refreshToken });

    expect(result.accessToken).to.be.a("string");
    expect(result.refreshToken).to.be.a("string");
    expect(result.refreshToken).to.not.equal(initialPair.refreshToken);
    expect(repository.updateMock.callCount).to.equal(1);
  },

  async revokesSessionWhenRefreshTokenReuseIsDetected(): Promise<void> {
    const repository = new UserRepositoryStub();
    const initialPair = jwtService.generateTokenPair({
      userId: baseUser.id,
      email: baseUser.email,
      profile: baseUser.profile,
    });

    const persisted = new UserEntity({
      ...baseUser.toPrimitives(),
      refreshTokenHash: tokenHashService.hashToken("another-token"),
    });

    repository.findByIdMock.resolveWith(persisted);
    repository.updateMock.implement(async (_id, user) => user);

    const useCase = new RefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService
    );

    await expectAsyncError(
      () => useCase.execute({ refreshToken: initialPair.refreshToken }),
      UnauthorizedError
    );
    expect(repository.updateMock.callCount).to.equal(1);
  },
};
