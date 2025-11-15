import { DeleteUserUseCase } from "../../../src/application/usecases/users/DeleteUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("DeleteUserUseCase", () => {
  const user = UserEntity.create({
    name: "User to delete",
    email: "delete.me@example.com",
  });

  it("removes an existing user", async () => {
    const repository = new UserRepositoryStub();
    repository.findById.mockResolvedValue(user);
    repository.delete.mockResolvedValue(undefined);

    const useCase = new DeleteUserUseCase(repository);

    await expect(useCase.execute(user.id)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(user.id);
    expect(repository.delete).toHaveBeenCalledWith(user.id);
  });

  it("throws when the user does not exist", async () => {
    const repository = new UserRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new DeleteUserUseCase(repository);

    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
