import { expect } from "chai";
import { GetPresencesUseCase } from "../../../src/application/usecases/presences/GetPresencesUseCase";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { PresenceRepositoryStub } from "../../stubs/PresenceRepositoryStub";

export const getPresencesUseCaseSpecs = {
  async returnsPaginatedResults(): Promise<void> {
    const repository = new PresenceRepositoryStub();
    const presences = [
      PresenceEntity.create({
        eventId: "event-1",
        userId: "user-1",
      }),
    ];

    repository.findAllMock.resolveWith(presences);

    const useCase = new GetPresencesUseCase(repository);
    const result = await useCase.execute();

    expect(result.results).to.deep.equal(presences);
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
