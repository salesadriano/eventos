import { CreatePresenceUseCase } from "../../../src/application/usecases/presences/CreatePresenceUseCase";
import { DeletePresenceUseCase } from "../../../src/application/usecases/presences/DeletePresenceUseCase";
import { GetPresenceByIdUseCase } from "../../../src/application/usecases/presences/GetPresenceByIdUseCase";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import {
  NotFoundError,
  ValidationError,
} from "../../../src/domain/errors/ApplicationError";
import { PresenceRepositoryStub } from "../../../tests-cypress/stubs/PresenceRepositoryStub";
import { expectAsyncError } from "../utils/expectError";

describe("Presences use cases (migrated from tests-cypress)", () => {
  it("creates presence when no duplicate exists", async () => {
    const repository = new PresenceRepositoryStub();
    const presence = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });

    repository.findByEventMock.resolveWith([]);
    repository.findByIdMock.resolveWith(null);
    repository.createMock.resolveWith(presence);

    const useCase = new CreatePresenceUseCase(repository);
    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });

    expect(result).toEqual(presence);
    expect(repository.createMock.callCount).toBe(1);
  });

  it("throws on duplicate presence for same user and activity", async () => {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });
    repository.findByEventMock.resolveWith([existing]);

    const useCase = new CreatePresenceUseCase(repository);
    await expectAsyncError(
      () =>
        useCase.execute({
          eventId: "event-1",
          userId: "user-1",
          activityId: "activity-1",
        }),
      ValidationError,
    );
  });

  it("allows same user in different activities", async () => {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });
    const created = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-2",
    });

    repository.findByEventMock.resolveWith([existing]);
    repository.findByIdMock.resolveWith(null);
    repository.createMock.resolveWith(created);

    const useCase = new CreatePresenceUseCase(repository);
    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-2",
    });

    expect(result).toEqual(created);
    expect(repository.createMock.callCount).toBe(1);
  });

  it("gets presence by id and throws when missing", async () => {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-2",
      userId: "user-2",
    });
    const useCase = new GetPresenceByIdUseCase(repository);

    repository.findByIdMock.resolveWith(existing);
    await expect(useCase.execute(existing.id)).resolves.toEqual(existing);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  });

  it("deletes presence and throws when missing", async () => {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-3",
      userId: "user-3",
    });
    const useCase = new DeletePresenceUseCase(repository);

    repository.findByIdMock.resolveWith(existing);
    await useCase.execute(existing.id);
    expect(repository.deleteMock.callCount).toBe(1);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  });
});
