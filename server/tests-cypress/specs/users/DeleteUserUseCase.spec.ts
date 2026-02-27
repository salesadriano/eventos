import { expect } from "chai";
import { DeleteUserUseCase } from "../../../src/application/usecases/users/DeleteUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const deleteUserUseCaseSpecs = {
  async deletesExistingUser(): Promise<void> {
    const repository = new UserRepositoryStub();
    const user = UserEntity.create({
      name: "User to delete",
      email: "delete.me@example.com",
      profile: "user",
    });

    repository.findByIdMock.resolveWith(user);

    const useCase = new DeleteUserUseCase(repository);
    await useCase.execute(user.id);

    expect(repository.findByIdMock.calls[0][0]).to.equal(user.id);
    expect(repository.deleteMock.calls[0][0]).to.equal(user.id);
  },

  async throwsWhenMissing(): Promise<void> {
    const repository = new UserRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new DeleteUserUseCase(repository);

    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
    expect(repository.deleteMock.callCount).to.equal(0);
  },
};
