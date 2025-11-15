import { UpdateUserUseCase } from "../../../src/application/usecases/users/UpdateUserUseCase";
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

describe("UpdateUserUseCase", () => {
  it("updates an existing user", async () => {
    const repository = new UserRepositoryStub();
    const existingUser = UserEntity.create({
      name: "Original Name",
      email: "original@example.com",
    });

    repository.findById.mockResolvedValue(existingUser);
    repository.update.mockImplementation(async (_id, user) => user);

    const useCase = new UpdateUserUseCase(repository);

    const updated = await useCase.execute(existingUser.id, {
      name: "Updated Name",
    });

    expect(repository.findById).toHaveBeenCalledWith(existingUser.id);
    expect(repository.update).toHaveBeenCalledWith(
      existingUser.id,
      expect.any(UserEntity)
    );
    expect(updated.name).toBe("Updated Name");
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
      existingUser.updatedAt.getTime()
    );
  });

  it("throws when the user does not exist", async () => {
    const repository = new UserRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new UpdateUserUseCase(repository);

    await expect(
      useCase.execute("unknown-id", { name: "Does not matter" })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
