import { expect } from "chai";
import { CreateEventUseCase } from "../../../src/application/usecases/events/CreateEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { EventRepositoryStub } from "../../stubs/EventRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

const basePayload = {
  title: "New Event",
  description: "Event description",
  location: "Online",
  date: new Date("2024-02-02T00:00:00Z"),
  inscriptionInit: new Date("2024-01-01T00:00:00Z"),
  inscriptionFinal: new Date("2024-01-15T00:00:00Z"),
  dateInit: new Date("2024-02-02T00:00:00Z"),
  dateFinal: new Date("2024-02-03T00:00:00Z"),
} as const;

export const createEventUseCaseSpecs = {
  async createsEventWhenNotExists(): Promise<void> {
    const repository = new EventRepositoryStub();
    repository.findByIdMock.resolveWith(null);
    repository.createMock.implement(async (event) => event);

    const useCase = new CreateEventUseCase(repository);
    const created = await useCase.execute(basePayload);

    expect(repository.findByIdMock.callCount).to.equal(1);
    expect(repository.createMock.callCount).to.equal(1);
    expect(repository.createMock.calls[0][0]).to.equal(created);
    expect(created.toPrimitives()).to.include({
      title: basePayload.title,
      description: basePayload.description,
      location: basePayload.location,
    });
  },

  async throwsWhenDuplicateId(): Promise<void> {
    const repository = new EventRepositoryStub();
    const existing = EventEntity.create(basePayload);

    repository.findByIdMock.resolveWith(existing);

    const useCase = new CreateEventUseCase(repository);
    const duplicate = { ...basePayload, id: existing.id };

    await expectAsyncError(() => useCase.execute(duplicate), ValidationError);
    expect(repository.createMock.callCount).to.equal(0);
  },
};
