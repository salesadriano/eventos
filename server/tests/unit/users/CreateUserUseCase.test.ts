/// <reference types="jest" />

import { CreateUserUseCase } from "../../../src/application/usecases/users/CreateUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";
import { PasswordService } from "../../../src/infrastructure/auth/PasswordService";

class UserRepositoryStub extends UserRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEmail = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

class PasswordServiceStub extends PasswordService {
  hash = jest.fn();
  compare = jest.fn();
}

describe("CreateUserUseCase", () => {
  const payload = {
    name: "New User",
    email: "new.user@example.com",
    password: "password123",
    profile: "user" as const,
  } as const;

  it("persists a new user using the repository", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();

    repository.findById.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (user) => user);
    passwordService.hash.mockResolvedValue("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);

    const created = await useCase.execute(payload);

    expect(passwordService.hash).toHaveBeenCalledWith(payload.password);
    expect(repository.findByEmail).toHaveBeenCalledWith(payload.email);
    expect(repository.create).toHaveBeenCalledWith(created);
    expect(created.toPrimitives()).toMatchObject({
      name: payload.name,
      email: payload.email,
      profile: payload.profile,
    });
    expect(created.password).toBe("hashed_password");
  });

  it("creates user without password when password is not provided", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();

    repository.findById.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (user) => user);

    const useCase = new CreateUserUseCase(repository, passwordService);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payloadWithoutPassword } = payload;
    const created = await useCase.execute(payloadWithoutPassword);

    expect(passwordService.hash).not.toHaveBeenCalled();
    expect(created.password).toBeUndefined();
  });

  it("throws when a user with the same id already exists", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const existingUser = UserEntity.create(payload);

    repository.findById.mockResolvedValue(existingUser);
    passwordService.hash.mockResolvedValue("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);

    await expect(
      useCase.execute({ ...payload, id: existingUser.id })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("throws when a user with the same email already exists", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const existingUser = UserEntity.create(payload);

    repository.findById.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(existingUser);
    passwordService.hash.mockResolvedValue("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);

    await expect(useCase.execute(payload)).rejects.toBeInstanceOf(
      ValidationError
    );
    expect(repository.create).not.toHaveBeenCalled();
  });
});
