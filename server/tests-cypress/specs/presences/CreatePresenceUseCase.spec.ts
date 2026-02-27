import { expect } from "chai";
import { CreatePresenceUseCase } from "../../../src/application/usecases/presences/CreatePresenceUseCase";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { PresenceRepositoryStub } from "../../stubs/PresenceRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const createPresenceUseCaseSpecs = {
  async createsPresence(): Promise<void> {
    const repository = new PresenceRepositoryStub();
    const presence = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
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

    expect(result).to.equal(presence);
    expect(repository.findByEventMock.calls[0]).to.deep.equal(["event-1"]);
    expect(repository.createMock.callCount).to.equal(1);
  },

  async throwsWhenDuplicate(): Promise<void> {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
    });

    repository.findByEventMock.resolveWith([existing]);

    const useCase = new CreatePresenceUseCase(repository);

    await expectAsyncError(
      () =>
        useCase.execute({
          eventId: "event-1",
          userId: "user-1",
        }),
      ValidationError
    );

    expect(repository.createMock.callCount).to.equal(0);
  },

  async allowsSameUserInDifferentActivities(): Promise<void> {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });
    const presence = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-2",
    });

    repository.findByEventMock.resolveWith([existing]);
    repository.findByIdMock.resolveWith(null);
    repository.createMock.resolveWith(presence);

    const useCase = new CreatePresenceUseCase(repository);

    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-2",
    });

    expect(result).to.equal(presence);
    expect(repository.createMock.callCount).to.equal(1);
  },
};
