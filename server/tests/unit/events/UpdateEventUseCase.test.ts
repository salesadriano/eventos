/// <reference types="jest" />

import { UpdateEventUseCase } from "../../../src/application/usecases/events/UpdateEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { EventRepository } from "../../../src/domain/repositories/EventRepository";

class EventRepositoryStub extends EventRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("UpdateEventUseCase", () => {
  const baseEvent = EventEntity.create({
    title: "Existing Event",
    description: "Original description",
    date: new Date("2024-03-03T00:00:00Z"),
    location: "Initial location",
  });

  it("updates an existing event", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(baseEvent);
    repository.update.mockImplementation(async (_id, event) => event);

    const useCase = new UpdateEventUseCase(repository);

    const updated = await useCase.execute(baseEvent.id, {
      title: "Updated title",
      location: "Updated location",
    });

    expect(repository.findById).toHaveBeenCalledWith(baseEvent.id);
    expect(repository.update).toHaveBeenCalledWith(
      baseEvent.id,
      expect.any(EventEntity)
    );
    expect(updated.toPrimitives()).toMatchObject({
      id: baseEvent.id,
      title: "Updated title",
      location: "Updated location",
    });
  });

  it("throws when the event does not exist", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new UpdateEventUseCase(repository);

    await expect(
      useCase.execute("missing-id", { title: "Won't matter" })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
