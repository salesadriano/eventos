import { expect } from "chai";
import { GetEventsUseCase } from "../../../src/application/usecases/events/GetEventsUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { EventRepositoryStub } from "../../stubs/EventRepositoryStub";

export const getEventsUseCaseSpecs = {
  async returnsPaginatedResults(): Promise<void> {
    const repository = new EventRepositoryStub();
    const events = [
      EventEntity.create({
        title: "Test Event",
        description: "Description",
        location: "Remote",
        date: new Date("2024-01-01T00:00:00Z"),
        inscriptionInit: new Date("2023-12-01T00:00:00Z"),
        inscriptionFinal: new Date("2023-12-15T00:00:00Z"),
        dateInit: new Date("2024-01-01T00:00:00Z"),
        dateFinal: new Date("2024-01-02T00:00:00Z"),
      }),
    ];

    repository.findAllMock.resolveWith(events);

    const useCase = new GetEventsUseCase(repository);
    const result = await useCase.execute();

    expect(result.results).to.deep.equal(events);
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
