import { expect } from "chai";
import { CreateUserUseCase } from "../../../src/application/usecases/users/CreateUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { PasswordServiceStub } from "../../stubs/PasswordServiceStub";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

const basePayload = {
  name: "New User",
  email: "new.user@example.com",
  password: "password123",
  profile: "user" as const,
};

export const createUserUseCaseSpecs = {
  async createsUserWithHashedPassword(): Promise<void> {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();

    repository.findByIdMock.resolveWith(null);
    repository.findByEmailMock.resolveWith(null);
    repository.createMock.implement(async (user) => user);
    passwordService.hashMock.resolveWith("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);
    const created = await useCase.execute(basePayload);

    expect(passwordService.hashMock.calls[0][0]).to.equal(basePayload.password);
    expect(repository.findByEmailMock.calls[0][0]).to.equal(basePayload.email);
    expect(repository.createMock.calls[0][0]).to.equal(created);
    expect(created.toPrimitives()).to.include({
      name: basePayload.name,
      email: basePayload.email,
      profile: basePayload.profile,
    });
    expect(created.password).to.equal("hashed_password");
  },

  async createsUserWithoutPassword(): Promise<void> {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();

    repository.findByIdMock.resolveWith(null);
    repository.findByEmailMock.resolveWith(null);
    repository.createMock.implement(async (user) => user);

    const useCase = new CreateUserUseCase(repository, passwordService);
    const payloadWithoutPassword = {
      name: basePayload.name,
      email: basePayload.email,
      profile: basePayload.profile,
    };
    const created = await useCase.execute(payloadWithoutPassword);

    expect(passwordService.hashMock.callCount).to.equal(0);
    expect(created.password).to.equal(undefined);
  },

  async throwsWhenIdExists(): Promise<void> {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const existing = UserEntity.create(basePayload);

    repository.findByIdMock.resolveWith(existing);
    passwordService.hashMock.resolveWith("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);

    await expectAsyncError(
      () => useCase.execute({ ...basePayload, id: existing.id }),
      ValidationError
    );
    expect(repository.createMock.callCount).to.equal(0);
  },

  async throwsWhenEmailExists(): Promise<void> {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const existing = UserEntity.create(basePayload);

    repository.findByIdMock.resolveWith(null);
    repository.findByEmailMock.resolveWith(existing);
    passwordService.hashMock.resolveWith("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);

    await expectAsyncError(() => useCase.execute(basePayload), ValidationError);
    expect(repository.createMock.callCount).to.equal(0);
  },
};
