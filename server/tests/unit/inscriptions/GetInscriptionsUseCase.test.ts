/// <reference types="jest" />

import { GetInscriptionsUseCase } from "../../../src/application/usecases/inscriptions/GetInscriptionsUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { InscriptionRepository } from "../../../src/domain/repositories/InscriptionRepository";

class InscriptionRepositoryStub extends InscriptionRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEventAndUser = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("GetInscriptionsUseCase", () => {
  it("returns the inscriptions provided by the repository with pagination", async () => {
    const repository = new InscriptionRepositoryStub();
    const inscriptions = [
      InscriptionEntity.create({
        eventId: "event-1",
        userId: "user-1",
        status: "pending",
      }),
    ];
    repository.findAll.mockResolvedValue(inscriptions);

    const useCase = new GetInscriptionsUseCase(repository);

    const result = await useCase.execute();
    expect(result.results).toEqual(inscriptions);
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

