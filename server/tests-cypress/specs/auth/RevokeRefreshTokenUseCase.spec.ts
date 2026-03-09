import { expect } from "chai";
import { RevokeRefreshTokenUseCase } from "../../../src/application/usecases/auth/RevokeRefreshTokenUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../src/domain/errors/ApplicationError";
import { JwtService } from "../../../src/infrastructure/auth/JwtService";
import { TokenHashService } from "../../../src/infrastructure/auth/TokenHashService";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";

const jwtService = new JwtService({
  secret: "test-secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
});
const tokenHashService = new TokenHashService("test-secret");

const baseUser = UserEntity.create({
  name: "Test",
  email: "test@example.com",
  profile: "user",
});

export const revokeRefreshTokenUseCaseSpecs = {
  async revokesWhenTokenMatches(): Promise<void> {
    const repository = new UserRepositoryStub();
    const pair = jwtService.generateTokenPair({
      userId: baseUser.id,
      email: baseUser.email,
      profile: baseUser.profile,
    });

    const persisted = new UserEntity({
      ...baseUser.toPrimitives(),
      refreshTokenHash: tokenHashService.hashToken(pair.refreshToken),
    });

    repository.findByIdMock.resolveWith(persisted);
    repository.updateMock.implement(async (_id, u) => u);

    const useCase = new RevokeRefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService,
    );

    await useCase.execute(baseUser.id, pair.refreshToken);
    expect(repository.updateMock.callCount).to.equal(1);
    const updated = repository.updateMock.lastArgs[1] as UserEntity;
    expect(updated.refreshTokenHash).to.be.undefined;
  },

  async errorsWhenTokenInvalid(): Promise<void> {
    const repository = new UserRepositoryStub();
    const persisted = new UserEntity({
      ...baseUser.toPrimitives(),
      refreshTokenHash: tokenHashService.hashToken("other"),
    });

    repository.findByIdMock.resolveWith(persisted);
    const useCase = new RevokeRefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService,
    );

    try {
      await useCase.execute(baseUser.id, "wrong-token");
      throw new Error("should have thrown");
    } catch (err: any) {
      expect(err).to.be.instanceOf(UnauthorizedError);
    }
  },

  async errorsWhenUserNotFound(): Promise<void> {
    const repository = new UserRepositoryStub();
    repository.findByIdMock.resolveWith(null);
    const useCase = new RevokeRefreshTokenUseCase(
      repository,
      jwtService,
      tokenHashService,
    );

    try {
      await useCase.execute("nonexistent", "token");
      throw new Error("should have thrown");
    } catch (err: any) {
      expect(err).to.be.instanceOf(ValidationError);
    }
  },
};
