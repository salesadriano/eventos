import { expect } from "chai";
import { GetUsersUseCase } from "../../../src/application/usecases/users/GetUsersUseCase";
import { UserEntity } from "../../../src/domain/entities/UserEntity";
import { UserRepositoryStub } from "../../stubs/UserRepositoryStub";

export const getUsersUseCaseSpecs = {
  async returnsPaginatedUsers(): Promise<void> {
    const repository = new UserRepositoryStub();
    const users = [
      UserEntity.create({
        name: "Test User",
        email: "test.user@example.com",
        profile: "user",
      }),
    ];

    repository.findAllMock.resolveWith(users);

    const useCase = new GetUsersUseCase(repository);
    const result = await useCase.execute();

    expect(result.results).to.deep.equal(users);
    expect(result.meta).to.include({
      page: 1,
      limit: 1,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(repository.findAllMock.callCount).to.equal(1);
  },
};
