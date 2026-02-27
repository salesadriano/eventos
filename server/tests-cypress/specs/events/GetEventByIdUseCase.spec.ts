import { expect } from "chai";
import { GetEventByIdUseCase } from "../../../src/application/usecases/events/GetEventByIdUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { EventRepositoryStub } from "../../stubs/EventRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const getEventByIdUseCaseSpecs = {
  async returnsEvent(): Promise<void> {
    const repository = new EventRepositoryStub();
    const event = EventEntity.create({
      title: "Event",
      location: "Somewhere",
      description: "Details",
      date: new Date("2024-06-06T00:00:00Z"),
      inscriptionInit: new Date("2024-05-01T00:00:00Z"),
      inscriptionFinal: new Date("2024-05-15T00:00:00Z"),
      dateInit: new Date("2024-06-06T00:00:00Z"),
      dateFinal: new Date("2024-06-06T23:59:59Z"),
    });
    repository.findByIdMock.resolveWith(event);

    const useCase = new GetEventByIdUseCase(repository);
    const result = await useCase.execute(event.id);

    expect(result).to.equal(event);
    expect(repository.findByIdMock.calls[0][0]).to.equal(event.id);
  },

  async throwsWhenNotFound(): Promise<void> {
    const repository = new EventRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new GetEventByIdUseCase(repository);

    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  },
};
