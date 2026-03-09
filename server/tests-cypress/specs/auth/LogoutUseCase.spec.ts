import { expect } from "chai";
import { LogoutUseCase } from "../../../src/application/usecases/auth/LogoutUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";

export const logoutUseCaseSpecs = {
  async clearsRefreshTokenHash(): Promise<void> {
    const repository = new UserRepositoryStub();
    const user = UserEntity.create({
      name: "Test",
      email: "test@example.com",
      profile: "user",
      refreshTokenHash: "somehash",
    });

    repository.findByIdMock.resolveWith(user);
    repository.updateMock.implement(async (_id, u) => u);

    const useCase = new LogoutUseCase(repository);
    await useCase.execute(user.id);

    expect(repository.updateMock.callCount).to.equal(1);
    const updated = repository.updateMock.lastArgs[1] as UserEntity;
    expect(updated.refreshTokenHash).to.be.undefined;
  },

  async throwsWhenUserNotFound(): Promise<void> {
    const repository = new UserRepositoryStub();
    repository.findByIdMock.resolveWith(null);
    const useCase = new LogoutUseCase(repository);

    try {
      await useCase.execute("nonexistent");
      throw new Error("should have failed");
    } catch (err: any) {
      expect(err).to.be.instanceOf(ValidationError);
    }
  },
};
