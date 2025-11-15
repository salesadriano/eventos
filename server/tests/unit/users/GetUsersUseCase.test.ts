/// <reference types="jest" />

import { GetUsersUseCase } from "../../../src/application/usecases/users/GetUsersUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEmail = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("GetUsersUseCase", () => {
  it("returns the users provided by the repository with pagination", async () => {
    const repository = new UserRepositoryStub();
    const users = [
      UserEntity.create({
        name: "Test User",
        email: "test.user@example.com",
      }),
    ];
    repository.findAll.mockResolvedValue(users);

    const useCase = new GetUsersUseCase(repository);

    const result = await useCase.execute();
    expect(result.results).toEqual(users);
    expect(result.meta).toMatchObject({
      page: 1,
      limit: 1,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
