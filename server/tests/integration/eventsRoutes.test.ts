import request from "supertest";
import { createApp } from "../../src/app";
import { CreateEventUseCase } from "../../src/application/usecases/events/CreateEventUseCase";
import { DeleteEventUseCase } from "../../src/application/usecases/events/DeleteEventUseCase";
import { GetEventByIdUseCase } from "../../src/application/usecases/events/GetEventByIdUseCase";
import { GetEventsUseCase } from "../../src/application/usecases/events/GetEventsUseCase";
import { UpdateEventUseCase } from "../../src/application/usecases/events/UpdateEventUseCase";
import { EventEntity } from "../../src/domain/entities/EventEntity";
import { EventRepository } from "../../src/domain/repositories/EventRepository";
import type { GoogleSheetsClient } from "../../src/infrastructure/google/GoogleSheetsClient";
import { EventController } from "../../src/presentation/http/controllers/EventController";
import { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";
import type { UserController } from "../../src/presentation/http/controllers/UserController";

class InMemoryEventRepository extends EventRepository {
  private readonly events = new Map<string, EventEntity>();

  async findAll(): Promise<EventEntity[]> {
    return Array.from(this.events.values());
  }

  async findById(id: string): Promise<EventEntity | null> {
    return this.events.get(id) ?? null;
  }

  async create(eventEntity: EventEntity): Promise<EventEntity> {
    this.events.set(eventEntity.id, eventEntity);
    return eventEntity;
  }

  async update(id: string, eventEntity: EventEntity): Promise<EventEntity> {
    this.events.set(id, eventEntity);
    return eventEntity;
  }

  async delete(id: string): Promise<void> {
    this.events.delete(id);
  }
}

describe("Events HTTP routes", () => {
  const buildApp = () => {
    const repository = new InMemoryEventRepository();

    const getEventsUseCase = new GetEventsUseCase(repository);
    const getEventByIdUseCase = new GetEventByIdUseCase(repository);
    const createEventUseCase = new CreateEventUseCase(repository);
    const updateEventUseCase = new UpdateEventUseCase(repository);
    const deleteEventUseCase = new DeleteEventUseCase(repository);

    const eventController = new EventController({
      getEventsUseCase,
      getEventByIdUseCase,
      createEventUseCase,
      updateEventUseCase,
      deleteEventUseCase,
    });

    const googleSheetsClientStub = {
      getValues: async () => [],
      appendValues: async () => undefined,
      updateValues: async () => undefined,
      clearValues: async () => undefined,
    } as unknown as GoogleSheetsClient;

    const legacySheetsController = new LegacySheetsController({
      getEventsUseCase,
      createEventUseCase,
      updateEventUseCase,
      deleteEventUseCase,
      googleSheetsClient: googleSheetsClientStub,
    });

    const userControllerStub = {
      list: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as UserController;

    return createApp({
      controllers: {
        eventController,
        userController: userControllerStub,
        legacySheetsController,
      },
    });
  };

  it("creates, retrieves, updates and deletes events", async () => {
    const app = buildApp();
    const client = request(app);

    const initialResponse = await client.get("/api/events").expect(200);
    expect(initialResponse.body).toEqual([]);

    const createPayload = {
      title: "Integration Test Event",
      description: "Integration test",
      date: "2024-05-05T10:00:00.000Z",
      location: "Virtual",
    };

    const createResponse = await client
      .post("/api/events")
      .send(createPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      title: createPayload.title,
      description: createPayload.description,
      location: createPayload.location,
    });
    expect(typeof createResponse.body.id).toBe("string");

    const createdId: string = createResponse.body.id;

    const getByIdResponse = await client
      .get(`/api/events/${createdId}`)
      .expect(200);

    expect(getByIdResponse.body).toMatchObject({
      id: createdId,
      title: createPayload.title,
    });

    const updatePayload = {
      title: "Updated event title",
    };

    const updateResponse = await client
      .put(`/api/events/${createdId}`)
      .send(updatePayload)
      .expect(200);

    expect(updateResponse.body.title).toBe(updatePayload.title);

    await client.delete(`/api/events/${createdId}`).expect(204);

    const listAfterDeletion = await client.get("/api/events").expect(200);
    expect(listAfterDeletion.body).toEqual([]);
  });
});
