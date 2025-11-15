/// <reference types="jest" />

import { GetPresencesUseCase } from "../../../src/application/usecases/presences/GetPresencesUseCase";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { PresenceRepository } from "../../../src/domain/repositories/PresenceRepository";

class PresenceRepositoryStub extends PresenceRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEvent = jest.fn();
  create = jest.fn();
  delete = jest.fn();
}

describe("GetPresencesUseCase", () => {
  it("returns the presences provided by the repository with pagination", async () => {
    const repository = new PresenceRepositoryStub();
    const presences = [
      PresenceEntity.create({
        eventId: "event-1",
        userId: "user-1",
      }),
    ];
    repository.findAll.mockResolvedValue(presences);

    const useCase = new GetPresencesUseCase(repository);

    const result = await useCase.execute();
    expect(result.results).toEqual(presences);
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

