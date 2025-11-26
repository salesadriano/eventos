import { expect } from "chai";
import { UpdateUserUseCase } from "../../../src/application/usecases/users/UpdateUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const updateUserUseCaseSpecs = {
  async updatesExistingUser(): Promise<void> {
    const repository = new UserRepositoryStub();
    const existing = UserEntity.create({
      name: "Original Name",
      email: "original@example.com",
      profile: "user",
    });

    repository.findByIdMock.resolveWith(existing);
    repository.updateMock.implement(async (_id, user) => user);

    const useCase = new UpdateUserUseCase(repository);
    const updated = await useCase.execute(existing.id, {
      name: "Updated Name",
    });

    expect(repository.findByIdMock.calls[0][0]).to.equal(existing.id);
    expect(repository.updateMock.calls[0][0]).to.equal(existing.id);
    expect(updated.name).to.equal("Updated Name");
    expect(updated.updatedAt.getTime()).to.be.gte(existing.updatedAt.getTime());
  },

  async throwsWhenMissing(): Promise<void> {
    const repository = new UserRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new UpdateUserUseCase(repository);

    await expectAsyncError(
      () => useCase.execute("missing", { name: "N/A" }),
      NotFoundError
    );
    expect(repository.updateMock.callCount).to.equal(0);
  },
};
