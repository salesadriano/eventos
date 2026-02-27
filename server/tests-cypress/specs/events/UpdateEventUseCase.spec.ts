import { expect } from "chai";
import { UpdateEventUseCase } from "../../../src/application/usecases/events/UpdateEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { EventRepositoryStub } from "../../stubs/EventRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const updateEventUseCaseSpecs = {
  async updatesExistingEvent(): Promise<void> {
    const repository = new EventRepositoryStub();
    const existing = EventEntity.create({
      title: "Existing Event",
      description: "Original description",
      location: "Initial location",
      date: new Date("2024-03-03T00:00:00Z"),
      inscriptionInit: new Date("2024-02-01T00:00:00Z"),
      inscriptionFinal: new Date("2024-02-10T00:00:00Z"),
      dateInit: new Date("2024-03-03T00:00:00Z"),
      dateFinal: new Date("2024-03-03T23:59:59Z"),
    });

    repository.findByIdMock.resolveWith(existing);
    repository.updateMock.implement(async (_id, entity) => entity);

    const useCase = new UpdateEventUseCase(repository);

    const updated = await useCase.execute(existing.id, {
      title: "Updated title",
      location: "Updated location",
      appHeaderImageUrl: "https://cdn.example.com/new-app-header.png",
      certificateHeaderImageUrl:
        "https://cdn.example.com/new-certificate-header.png",
    });

    expect(repository.findByIdMock.calls[0][0]).to.equal(existing.id);
    expect(repository.updateMock.calls[0][0]).to.equal(existing.id);
    expect(updated.toPrimitives()).to.include({
      id: existing.id,
      title: "Updated title",
      location: "Updated location",
      appHeaderImageUrl: "https://cdn.example.com/new-app-header.png",
      certificateHeaderImageUrl:
        "https://cdn.example.com/new-certificate-header.png",
    });
  },

  async throwsWhenMissing(): Promise<void> {
    const repository = new EventRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new UpdateEventUseCase(repository);

    await expectAsyncError(
      () => useCase.execute("missing", { title: "x" }),
      NotFoundError
    );
    expect(repository.updateMock.callCount).to.equal(0);
  },
};
