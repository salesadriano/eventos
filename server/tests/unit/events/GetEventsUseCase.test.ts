import { GetEventsUseCase } from "../../../src/application/usecases/events/GetEventsUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { EventRepository } from "../../../src/domain/repositories/EventRepository";

class EventRepositoryStub extends EventRepository {
  findAll = jest.fn();
  findById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("GetEventsUseCase", () => {
  it("returns the events provided by the repository", async () => {
    const repository = new EventRepositoryStub();
    const events = [
      EventEntity.create({
        title: "Test Event",
        date: new Date("2024-01-01T00:00:00Z"),
        description: "Description",
        location: "Remote",
      }),
    ];
    repository.findAll.mockResolvedValue(events);

    const useCase = new GetEventsUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(events);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
