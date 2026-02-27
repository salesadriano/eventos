import { expect } from "chai";
import { GetInscriptionsUseCase } from "../../../src/application/usecases/inscriptions/GetInscriptionsUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { InscriptionRepositoryStub } from "../../stubs/InscriptionRepositoryStub";

export const getInscriptionsUseCaseSpecs = {
  async returnsPaginatedResults(): Promise<void> {
    const repository = new InscriptionRepositoryStub();
    const inscriptions = [
      InscriptionEntity.create({
        eventId: "event-1",
        userId: "user-1",
        status: "pending",
      }),
    ];

    repository.findAllMock.resolveWith(inscriptions);

    const useCase = new GetInscriptionsUseCase(repository);
    const result = await useCase.execute();

    expect(result.results).to.deep.equal(inscriptions);
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
