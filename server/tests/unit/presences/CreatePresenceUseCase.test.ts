/// <reference types="jest" />

import { CreatePresenceUseCase } from "../../../src/application/usecases/presences/CreatePresenceUseCase";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { PresenceRepository } from "../../../src/domain/repositories/PresenceRepository";

class PresenceRepositoryStub extends PresenceRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEvent = jest.fn();
  create = jest.fn();
  delete = jest.fn();
}

describe("CreatePresenceUseCase", () => {
  it("creates a new presence", async () => {
    const repository = new PresenceRepositoryStub();
    const presence = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
    });
    repository.findByEvent.mockResolvedValue([]);
    repository.findById.mockResolvedValue(null);
    repository.create.mockResolvedValue(presence);

    const useCase = new CreatePresenceUseCase(repository);

    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
    });

    expect(result).toEqual(presence);
    expect(repository.findByEvent).toHaveBeenCalledWith("event-1");
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("throws error if presence already exists for event and user", async () => {
    const repository = new PresenceRepositoryStub();
    const existing = PresenceEntity.create({
      eventId: "event-1",
      userId: "user-1",
    });
    repository.findByEvent.mockResolvedValue([existing]);

    const useCase = new CreatePresenceUseCase(repository);

    await expect(
      useCase.execute({
        eventId: "event-1",
        userId: "user-1",
      })
    ).rejects.toThrow(ValidationError);

    expect(repository.create).not.toHaveBeenCalled();
  });
});

