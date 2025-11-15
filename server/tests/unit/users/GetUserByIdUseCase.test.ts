/// <reference types="jest" />

import { GetUserByIdUseCase } from "../../../src/application/usecases/users/GetUserByIdUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEmail = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("GetUserByIdUseCase", () => {
  it("returns the user when it exists", async () => {
    const repository = new UserRepositoryStub();
    const user = UserEntity.create({
      name: "Existing User",
      email: "existing@example.com",
    });
    repository.findById.mockResolvedValue(user);

    const useCase = new GetUserByIdUseCase(repository);

    await expect(useCase.execute(user.id)).resolves.toBe(user);
    expect(repository.findById).toHaveBeenCalledWith(user.id);
  });

  it("throws when the user does not exist", async () => {
    const repository = new UserRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new GetUserByIdUseCase(repository);

    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
