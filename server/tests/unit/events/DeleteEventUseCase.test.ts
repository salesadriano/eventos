import { DeleteEventUseCase } from "../../../src/application/usecases/events/DeleteEventUseCase";
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

describe("DeleteEventUseCase", () => {
  const event = EventEntity.create({
    title: "Delete me",
    description: "Delete description",
    date: new Date("2024-04-04T00:00:00Z"),
    location: "Delete location",
  });

  it("removes an existing event", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(event);
    repository.delete.mockResolvedValue(undefined);

    const useCase = new DeleteEventUseCase(repository);

    await expect(useCase.execute(event.id)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(event.id);
    expect(repository.delete).toHaveBeenCalledWith(event.id);
  });

  it("throws when the event does not exist", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(null);

    const useCase = new DeleteEventUseCase(repository);

    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      NotFoundError
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
