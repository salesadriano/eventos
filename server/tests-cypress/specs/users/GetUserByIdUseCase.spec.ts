import { expect } from "chai";
import { GetUserByIdUseCase } from "../../../src/application/usecases/users/GetUserByIdUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const getUserByIdUseCaseSpecs = {
  async returnsExistingUser(): Promise<void> {
    const repository = new UserRepositoryStub();
    const user = UserEntity.create({
      name: "Existing User",
      email: "existing@example.com",
      profile: "user",
    });

    repository.findByIdMock.resolveWith(user);

    const useCase = new GetUserByIdUseCase(repository);
    const result = await useCase.execute(user.id);

    expect(result).to.equal(user);
    expect(repository.findByIdMock.calls[0][0]).to.equal(user.id);
  },

  async throwsWhenMissing(): Promise<void> {
    const repository = new UserRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new GetUserByIdUseCase(repository);

    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  },
};
