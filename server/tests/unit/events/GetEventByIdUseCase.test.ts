/// <reference types="jest" />

import { GetEventByIdUseCase } from "../../../src/application/usecases/events/GetEventByIdUseCase";
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

describe("GetEventByIdUseCase", () => {
  const event = EventEntity.create({
    title: "Event",
    description: "Details",
    date: new Date("2024-06-06T00:00:00Z"),
    location: "Somewhere",
  });

  it("returns the event when found", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(event);

    const useCase = new GetEventByIdUseCase(repository);

    await expect(useCase.execute(event.id)).resolves.toBe(event);
    expect(repository.findById).toHaveBeenCalledWith(event.id);
  });

  it("throws when the event is not found", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new GetEventByIdUseCase(repository);

    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
