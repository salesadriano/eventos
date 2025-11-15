/// <reference types="jest" />

import request from "supertest";
import { createApp } from "../../src/app";
import { CreateEventUseCase } from "../../src/application/usecases/events/CreateEventUseCase";
import { DeleteEventUseCase } from "../../src/application/usecases/events/DeleteEventUseCase";
import { GetEventByIdUseCase } from "../../src/application/usecases/events/GetEventByIdUseCase";
import { GetEventsUseCase } from "../../src/application/usecases/events/GetEventsUseCase";
import { UpdateEventUseCase } from "../../src/application/usecases/events/UpdateEventUseCase";
import { EventEntity } from "../../src/domain/entities/EventEntity";
import { EventRepository } from "../../src/domain/repositories/EventRepository";
import { UserEntity } from "../../src/domain/entities/UserEntity";
import { UserRepository } from "../../src/domain/repositories/UserRepository";
import type { GoogleSheetsClient } from "../../src/infrastructure/google/GoogleSheetsClient";
import { PasswordService } from "../../src/infrastructure/auth/PasswordService";
import { JwtService } from "../../src/infrastructure/auth/JwtService";
import { environment } from "../../src/config/environment";
import { LoginUseCase } from "../../src/application/usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../src/application/usecases/auth/RefreshTokenUseCase";
import { ValidateTokenUseCase } from "../../src/application/usecases/auth/ValidateTokenUseCase";
import { AuthController } from "../../src/presentation/http/controllers/AuthController";
import { EventController } from "../../src/presentation/http/controllers/EventController";
import { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";
import type { UserController } from "../../src/presentation/http/controllers/UserController";
import type { EmailController } from "../../src/presentation/http/controllers/EmailController";
import type { InscriptionController } from "../../src/presentation/http/controllers/InscriptionController";
import type { PresenceController } from "../../src/presentation/http/controllers/PresenceController";

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

    const userRepository = new (class extends UserRepository {
      private readonly users = new Map<string, UserEntity>();

      async findAll(): Promise<UserEntity[]> {
        return Array.from(this.users.values());
      }

      async findById(id: string): Promise<UserEntity | null> {
        return this.users.get(id) ?? null;
      }

      async findByEmail(email: string): Promise<UserEntity | null> {
        return (
          Array.from(this.users.values()).find((u) => u.email === email) ?? null
        );
      }

      async create(userEntity: UserEntity): Promise<UserEntity> {
        this.users.set(userEntity.id, userEntity);
        return userEntity;
      }

      async update(id: string, userEntity: UserEntity): Promise<UserEntity> {
        this.users.set(id, userEntity);
        return userEntity;
      }

      async delete(id: string): Promise<void> {
        this.users.delete(id);
      }
    })();

    const passwordService = new PasswordService();
    const jwtService = new JwtService(environment.jwt);

    const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);
    const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtService);
    const validateTokenUseCase = new ValidateTokenUseCase(userRepository, jwtService);

    const authController = new AuthController({
      loginUseCase,
      refreshTokenUseCase,
      validateTokenUseCase,
    });

    const userControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as UserController;

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const inscriptionControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as InscriptionController;

    const presenceControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as PresenceController;

    return createApp({
      controllers: {
        authController,
        eventController,
        userController: userControllerStub,
        inscriptionController: inscriptionControllerStub,
        presenceController: presenceControllerStub,
        emailController: emailControllerStub,
        legacySheetsController,
      },
    });
  };

  const createAuthenticatedUser = async (
    app: ReturnType<typeof buildApp>,
    userRepository: UserRepository,
    passwordService: PasswordService
  ): Promise<string> => {
    const testUser = UserEntity.create({
      name: "Test User",
      email: "test@example.com",
      password: await passwordService.hash("password123"),
      profile: "user",
    });

    await userRepository.create(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .expect(200);

    return loginResponse.body.accessToken;
  };

  it("requires authentication for all event routes", async () => {
    const app = buildApp();
    const client = request(app);

    // All routes should return 401 without authentication
    await client.get("/api/events").expect(401);
    await client.get("/api/events/all").expect(401);
    await client.get("/api/events/test-id").expect(401);
    await client.post("/api/events").send({ title: "Test" }).expect(401);
    await client.put("/api/events/test-id").send({ title: "Test" }).expect(401);
    await client.patch("/api/events/test-id").send({ title: "Test" }).expect(401);
    await client.delete("/api/events/test-id").expect(401);
  });

  it("creates, retrieves, updates and deletes events with authentication", async () => {
    const repository = new InMemoryEventRepository();
    const userRepository = new (class extends UserRepository {
      private readonly users = new Map<string, UserEntity>();

      async findAll(): Promise<UserEntity[]> {
        return Array.from(this.users.values());
      }

      async findById(id: string): Promise<UserEntity | null> {
        return this.users.get(id) ?? null;
      }

      async findByEmail(email: string): Promise<UserEntity | null> {
        return (
          Array.from(this.users.values()).find((u) => u.email === email) ?? null
        );
      }

      async create(userEntity: UserEntity): Promise<UserEntity> {
        this.users.set(userEntity.id, userEntity);
        return userEntity;
      }

      async update(id: string, userEntity: UserEntity): Promise<UserEntity> {
        this.users.set(id, userEntity);
        return userEntity;
      }

      async delete(id: string): Promise<void> {
        this.users.delete(id);
      }
    })();

    const passwordService = new PasswordService();
    const jwtService = new JwtService(environment.jwt);

    const getEventsUseCase = new GetEventsUseCase(repository);
    const getEventByIdUseCase = new GetEventByIdUseCase(repository);
    const createEventUseCase = new CreateEventUseCase(repository);
    const updateEventUseCase = new UpdateEventUseCase(repository);
    const deleteEventUseCase = new DeleteEventUseCase(repository);

    const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);
    const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtService);
    const validateTokenUseCase = new ValidateTokenUseCase(userRepository, jwtService);

    const eventController = new EventController({
      getEventsUseCase,
      getEventByIdUseCase,
      createEventUseCase,
      updateEventUseCase,
      deleteEventUseCase,
    });

    const authController = new AuthController({
      loginUseCase,
      refreshTokenUseCase,
      validateTokenUseCase,
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
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as UserController;

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const inscriptionControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as InscriptionController;

    const presenceControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as PresenceController;

    const app = createApp({
      controllers: {
        authController,
        eventController,
        userController: userControllerStub,
        inscriptionController: inscriptionControllerStub,
        presenceController: presenceControllerStub,
        emailController: emailControllerStub,
        legacySheetsController,
      },
    });

    const token = await createAuthenticatedUser(app, userRepository, passwordService);
    const client = request(app);

    const initialResponse = await client
      .get("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(initialResponse.body.results).toEqual([]);

    const createPayload = {
      title: "Integration Test Event",
      description: "Integration test",
      date: "2024-05-05T10:00:00.000Z",
      location: "Virtual",
    };

    const createResponse = await client
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send(updatePayload)
      .expect(200);

    expect(updateResponse.body.title).toBe(updatePayload.title);

    await client
      .delete(`/api/events/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const listAfterDeletion = await client
      .get("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(listAfterDeletion.body.results).toEqual([]);
  });
});
