import { GetUsersUseCase } from "../../../src/application/usecases/users/GetUsersUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("GetUsersUseCase", () => {
  it("returns the users provided by the repository", async () => {
    const repository = new UserRepositoryStub();
    const users = [
      UserEntity.create({
        name: "Test User",
        email: "test.user@example.com",
      }),
    ];
    repository.findAll.mockResolvedValue(users);

    const useCase = new GetUsersUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(users);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
