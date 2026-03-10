import { CreateEventUseCase } from "../../../src/application/usecases/events/CreateEventUseCase";
import { DeleteEventUseCase } from "../../../src/application/usecases/events/DeleteEventUseCase";
import { GetEventByIdUseCase } from "../../../src/application/usecases/events/GetEventByIdUseCase";
import { UpdateEventUseCase } from "../../../src/application/usecases/events/UpdateEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import {
  NotFoundError,
  ValidationError,
} from "../../../src/domain/errors/ApplicationError";
import { EventRepositoryStub } from "../../../tests-cypress/stubs/EventRepositoryStub";
import { expectAsyncError } from "../utils/expectError";

const basePayload = {
  title: "New Event",
  description: "Event description",
  location: "Online",
  appHeaderImageUrl: "https://cdn.example.com/app-header.png",
  certificateHeaderImageUrl: "https://cdn.example.com/certificate-header.png",
  date: new Date("2024-02-02T00:00:00Z"),
  inscriptionInit: new Date("2024-01-01T00:00:00Z"),
  inscriptionFinal: new Date("2024-01-15T00:00:00Z"),
  dateInit: new Date("2024-02-02T00:00:00Z"),
  dateFinal: new Date("2024-02-03T00:00:00Z"),
} as const;

describe("Events use cases (migrated from tests-cypress)", () => {
  it("creates event when id does not exist", async () => {
    const repository = new EventRepositoryStub();
    repository.findByIdMock.resolveWith(null);
    repository.createMock.implement(async (event) => event);

    const useCase = new CreateEventUseCase(repository);
    const created = await useCase.execute(basePayload);

    expect(repository.findByIdMock.callCount).toBe(1);
    expect(repository.createMock.callCount).toBe(1);
    expect(created.toPrimitives()).toMatchObject({
      title: basePayload.title,
      location: basePayload.location,
      appHeaderImageUrl: basePayload.appHeaderImageUrl,
      certificateHeaderImageUrl: basePayload.certificateHeaderImageUrl,
    });
  });

  it("throws validation error for invalid image url", async () => {
    const repository = new EventRepositoryStub();
    const useCase = new CreateEventUseCase(repository);

    await expectAsyncError(
      () =>
        useCase.execute({
          ...basePayload,
          appHeaderImageUrl: "ftp://invalid-image-url",
        }),
      ValidationError,
    );

    expect(repository.createMock.callCount).toBe(0);
  });

  it("gets event by id and throws when missing", async () => {
    const repository = new EventRepositoryStub();
    const useCase = new GetEventByIdUseCase(repository);
    const existing = EventEntity.create(basePayload);

    repository.findByIdMock.resolveWith(existing);
    await expect(useCase.execute(existing.id)).resolves.toEqual(existing);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing-id"), NotFoundError);
  });

  it("updates event and throws when missing", async () => {
    const repository = new EventRepositoryStub();
    const existing = EventEntity.create(basePayload);
    repository.findByIdMock.resolveWith(existing);
    repository.updateMock.implement(async (_id, entity) => entity);

    const useCase = new UpdateEventUseCase(repository);
    const updated = await useCase.execute(existing.id, {
      title: "Updated title",
      location: "Updated location",
    });

    expect(updated.id).toBe(existing.id);
    expect(updated.title).toBe("Updated title");
    expect(updated.location).toBe("Updated location");

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(
      () => useCase.execute("missing", { title: "x" }),
      NotFoundError,
    );
  });

  it("deletes event and throws when missing", async () => {
    const repository = new EventRepositoryStub();
    const existing = EventEntity.create(basePayload);
    const useCase = new DeleteEventUseCase(repository);

    repository.findByIdMock.resolveWith(existing);
    await useCase.execute(existing.id);
    expect(repository.deleteMock.callCount).toBe(1);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  });
});