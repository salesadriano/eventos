import { CreateEventUseCase } from "../../../src/application/usecases/events/CreateEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { EventRepository } from "../../../src/domain/repositories/EventRepository";

class EventRepositoryStub extends EventRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("CreateEventUseCase", () => {
  const payload = {
    title: "New Event",
    description: "Event description",
    date: new Date("2024-02-02T00:00:00Z"),
    location: "Online",
  } as const;

  it("persists a new event using the repository", async () => {
    const repository = new EventRepositoryStub();
    repository.findById.mockResolvedValue(null);
    repository.create.mockImplementation(async (event) => event);

    const useCase = new CreateEventUseCase(repository);

    const created = await useCase.execute(payload);

    expect(repository.findById).toHaveBeenCalledWith(created.id);
    expect(repository.create).toHaveBeenCalledWith(created);
    expect(created.toPrimitives()).toMatchObject({
      title: payload.title,
      description: payload.description,
      location: payload.location,
    });
  });

  it("throws when an event with the same id already exists", async () => {
    const repository = new EventRepositoryStub();
    const existingEvent = EventEntity.create(payload);

    repository.findById.mockResolvedValue(existingEvent);

    const useCase = new CreateEventUseCase(repository);

    await expect(
      useCase.execute({ ...payload, id: existingEvent.id })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
