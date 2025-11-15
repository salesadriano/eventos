/// <reference types="jest" />

import request from "supertest";
import { createApp } from "../../src/app";
import { CreateInscriptionUseCase } from "../../src/application/usecases/inscriptions/CreateInscriptionUseCase";
import { DeleteInscriptionUseCase } from "../../src/application/usecases/inscriptions/DeleteInscriptionUseCase";
import { GetInscriptionByIdUseCase } from "../../src/application/usecases/inscriptions/GetInscriptionByIdUseCase";
import { GetInscriptionsUseCase } from "../../src/application/usecases/inscriptions/GetInscriptionsUseCase";
import { UpdateInscriptionUseCase } from "../../src/application/usecases/inscriptions/UpdateInscriptionUseCase";
import { InscriptionEntity } from "../../src/domain/entities/InscriptionEntity";
import { InscriptionRepository } from "../../src/domain/repositories/InscriptionRepository";
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
import { InscriptionController } from "../../src/presentation/http/controllers/InscriptionController";
import type { EventController } from "../../src/presentation/http/controllers/EventController";
import type { UserController } from "../../src/presentation/http/controllers/UserController";
import type { EmailController } from "../../src/presentation/http/controllers/EmailController";
import type { PresenceController } from "../../src/presentation/http/controllers/PresenceController";
import { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";

class InMemoryInscriptionRepository extends InscriptionRepository {
  private readonly inscriptions = new Map<string, InscriptionEntity>();

  async findAll(): Promise<InscriptionEntity[]> {
    return Array.from(this.inscriptions.values());
  }

  async findById(id: string): Promise<InscriptionEntity | null> {
    return this.inscriptions.get(id) ?? null;
  }

  async findByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<InscriptionEntity | null> {
    return (
      Array.from(this.inscriptions.values()).find(
        (i) => i.eventId === eventId && i.userId === userId
      ) ?? null
    );
  }

  async create(
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    this.inscriptions.set(inscriptionEntity.id, inscriptionEntity);
    return inscriptionEntity;
  }

  async update(
    id: string,
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    this.inscriptions.set(id, inscriptionEntity);
    return inscriptionEntity;
  }

  async delete(id: string): Promise<void> {
    this.inscriptions.delete(id);
  }
}

describe("Inscriptions HTTP routes", () => {
  const buildApp = () => {
    const repository = new InMemoryInscriptionRepository();

    const getInscriptionsUseCase = new GetInscriptionsUseCase(repository);
    const getInscriptionByIdUseCase = new GetInscriptionByIdUseCase(repository);
    const createInscriptionUseCase = new CreateInscriptionUseCase(repository);
    const updateInscriptionUseCase = new UpdateInscriptionUseCase(repository);
    const deleteInscriptionUseCase = new DeleteInscriptionUseCase(repository);

    const inscriptionController = new InscriptionController({
      getInscriptionsUseCase,
      getInscriptionByIdUseCase,
      createInscriptionUseCase,
      updateInscriptionUseCase,
      deleteInscriptionUseCase,
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

    const loginUseCase = new LoginUseCase(
      userRepository,
      passwordService,
      jwtService
    );
    const refreshTokenUseCase = new RefreshTokenUseCase(
      userRepository,
      jwtService
    );
    const validateTokenUseCase = new ValidateTokenUseCase(
      userRepository,
      jwtService
    );

    const authController = new AuthController({
      loginUseCase,
      refreshTokenUseCase,
      validateTokenUseCase,
    });

    const eventControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as EventController;

    const userControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as UserController;

    const presenceControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as PresenceController;

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const googleSheetsClientStub = {
      getValues: async () => [],
      appendValues: async () => undefined,
      updateValues: async () => undefined,
      clearValues: async () => undefined,
    } as unknown as GoogleSheetsClient;

    const legacySheetsController = new LegacySheetsController({
      getEventsUseCase: {} as any,
      createEventUseCase: {} as any,
      updateEventUseCase: {} as any,
      deleteEventUseCase: {} as any,
      googleSheetsClient: googleSheetsClientStub,
    });

    return createApp({
      controllers: {
        authController,
        eventController: eventControllerStub,
        userController: userControllerStub,
        inscriptionController,
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

  it("requires authentication for all inscription routes", async () => {
    const app = buildApp();
    const client = request(app);

    await client.get("/api/inscriptions").expect(401);
    await client.get("/api/inscriptions/all").expect(401);
    await client.get("/api/inscriptions/test-id").expect(401);
    await client
      .post("/api/inscriptions")
      .send({ eventId: "event-1", userId: "user-1" })
      .expect(401);
    await client
      .put("/api/inscriptions/test-id")
      .send({ status: "confirmed" })
      .expect(401);
    await client
      .patch("/api/inscriptions/test-id")
      .send({ status: "confirmed" })
      .expect(401);
    await client.delete("/api/inscriptions/test-id").expect(401);
  });

  it("creates, retrieves, updates and deletes inscriptions with authentication", async () => {
    const repository = new InMemoryInscriptionRepository();
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

    const getInscriptionsUseCase = new GetInscriptionsUseCase(repository);
    const getInscriptionByIdUseCase = new GetInscriptionByIdUseCase(repository);
    const createInscriptionUseCase = new CreateInscriptionUseCase(repository);
    const updateInscriptionUseCase = new UpdateInscriptionUseCase(repository);
    const deleteInscriptionUseCase = new DeleteInscriptionUseCase(repository);

    const loginUseCase = new LoginUseCase(
      userRepository,
      passwordService,
      jwtService
    );
    const refreshTokenUseCase = new RefreshTokenUseCase(
      userRepository,
      jwtService
    );
    const validateTokenUseCase = new ValidateTokenUseCase(
      userRepository,
      jwtService
    );

    const inscriptionController = new InscriptionController({
      getInscriptionsUseCase,
      getInscriptionByIdUseCase,
      createInscriptionUseCase,
      updateInscriptionUseCase,
      deleteInscriptionUseCase,
    });

    const authController = new AuthController({
      loginUseCase,
      refreshTokenUseCase,
      validateTokenUseCase,
    });

    const eventControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as EventController;

    const userControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as UserController;

    const presenceControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as PresenceController;

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const googleSheetsClientStub = {
      getValues: async () => [],
      appendValues: async () => undefined,
      updateValues: async () => undefined,
      clearValues: async () => undefined,
    } as unknown as GoogleSheetsClient;

    const legacySheetsController = new LegacySheetsController({
      getEventsUseCase: {} as any,
      createEventUseCase: {} as any,
      updateEventUseCase: {} as any,
      deleteEventUseCase: {} as any,
      googleSheetsClient: googleSheetsClientStub,
    });

    const app = createApp({
      controllers: {
        authController,
        eventController: eventControllerStub,
        userController: userControllerStub,
        inscriptionController,
        presenceController: presenceControllerStub,
        emailController: emailControllerStub,
        legacySheetsController,
      },
    });

    const token = await createAuthenticatedUser(
      app,
      userRepository,
      passwordService
    );
    const client = request(app);

    const initialResponse = await client
      .get("/api/inscriptions")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(initialResponse.body.results).toEqual([]);

    const createPayload = {
      eventId: "event-1",
      userId: "user-1",
      status: "pending",
    };

    const createResponse = await client
      .post("/api/inscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send(createPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      eventId: createPayload.eventId,
      userId: createPayload.userId,
      status: createPayload.status,
    });
    expect(typeof createResponse.body.id).toBe("string");

    const createdId: string = createResponse.body.id;

    const getByIdResponse = await client
      .get(`/api/inscriptions/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(getByIdResponse.body).toMatchObject({
      id: createdId,
      eventId: createPayload.eventId,
      userId: createPayload.userId,
    });

    const updatePayload = {
      status: "confirmed",
    };

    const updateResponse = await client
      .put(`/api/inscriptions/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatePayload)
      .expect(200);

    expect(updateResponse.body.status).toBe(updatePayload.status);

    await client
      .delete(`/api/inscriptions/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const listAfterDeletion = await client
      .get("/api/inscriptions")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(listAfterDeletion.body.results).toEqual([]);
  });
});

