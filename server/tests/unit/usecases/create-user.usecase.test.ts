import { CreateUserUseCase } from "../../../src/application/usecases/users/CreateUserUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { PasswordServiceStub } from "../../../tests-cypress/stubs/PasswordServiceStub";
import { UserRepositoryStub } from "../../../tests-cypress/stubs/UserRepositoryStub";
import { expectAsyncError } from "../utils/expectError";

const basePayload = {
  name: "New User",
  email: "new.user@example.com",
  password: "password123",
  profile: "user" as const,
};

describe("CreateUserUseCase (migrated from tests-cypress)", () => {
  it("createsUserWithHashedPassword", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();

    repository.findByIdMock.resolveWith(null);
    repository.findByEmailMock.resolveWith(null);
    repository.createMock.implement(async (user) => user);
    passwordService.hashMock.resolveWith("hashed_password");

    const useCase = new CreateUserUseCase(repository, passwordService);
    const created = await useCase.execute(basePayload);

    expect(passwordService.hashMock.calls[0][0]).toBe(basePayload.password);
    expect(repository.findByEmailMock.calls[0][0]).toBe(basePayload.email);
    expect(repository.createMock.calls[0][0]).toEqual(created);
    expect(created.toPrimitives()).toMatchObject({
      name: basePayload.name,
      email: basePayload.email,
      profile: basePayload.profile,
    });
    expect(created.password).toBe("hashed_password");
  });

  it("throwsWhenEmailExists", async () => {
    const repository = new UserRepositoryStub();
    const passwordService = new PasswordServiceStub();
    const existing = UserEntity.create(basePayload);

    repository.findByIdMock.resolveWith(null);
    repository.findByEmailMock.resolveWith(existing);

    const useCase = new CreateUserUseCase(repository, passwordService);

    await expectAsyncError(() => useCase.execute(basePayload), ValidationError);
    expect(repository.createMock.callCount).toBe(0);
  });
});
