import { CreateUserUseCase } from "../../../src/application/usecases/users/CreateUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("CreateUserUseCase", () => {
  const payload = {
    name: "New User",
    email: "new.user@example.com",
  } as const;

  it("persists a new user using the repository", async () => {
    const repository = new UserRepositoryStub();
    repository.findById.mockResolvedValue(null);
    repository.create.mockImplementation(async (user) => user);

    const useCase = new CreateUserUseCase(repository);

    const created = await useCase.execute(payload);

    expect(repository.findById).toHaveBeenCalledWith(created.id);
    expect(repository.create).toHaveBeenCalledWith(created);
    expect(created.toPrimitives()).toMatchObject({
      name: payload.name,
      email: payload.email,
    });
  });

  it("throws when a user with the same id already exists", async () => {
    const repository = new UserRepositoryStub();
    const existingUser = UserEntity.create(payload);

    repository.findById.mockResolvedValue(existingUser);

    const useCase = new CreateUserUseCase(repository);

    await expect(
      useCase.execute({ ...payload, id: existingUser.id })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
