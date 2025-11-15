/// <reference types="jest" />

import request from "supertest";
import { createApp } from "../../src/app";
import { CreatePresenceUseCase } from "../../src/application/usecases/presences/CreatePresenceUseCase";
import { DeletePresenceUseCase } from "../../src/application/usecases/presences/DeletePresenceUseCase";
import { GetPresenceByIdUseCase } from "../../src/application/usecases/presences/GetPresenceByIdUseCase";
import { GetPresencesUseCase } from "../../src/application/usecases/presences/GetPresencesUseCase";
import { PresenceEntity } from "../../src/domain/entities/PresenceEntity";
import { PresenceRepository } from "../../src/domain/repositories/PresenceRepository";
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
import { PresenceController } from "../../src/presentation/http/controllers/PresenceController";
import type { EventController } from "../../src/presentation/http/controllers/EventController";
import type { UserController } from "../../src/presentation/http/controllers/UserController";
import type { EmailController } from "../../src/presentation/http/controllers/EmailController";
import type { InscriptionController } from "../../src/presentation/http/controllers/InscriptionController";
import { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";

class InMemoryPresenceRepository extends PresenceRepository {
  private readonly presences = new Map<string, PresenceEntity>();

  async findAll(): Promise<PresenceEntity[]> {
    return Array.from(this.presences.values());
  }

  async findById(id: string): Promise<PresenceEntity | null> {
    return this.presences.get(id) ?? null;
  }

  async findByEvent(eventId: string): Promise<PresenceEntity[]> {
    return Array.from(this.presences.values()).filter(
      (p) => p.eventId === eventId
    );
  }

  async create(presenceEntity: PresenceEntity): Promise<PresenceEntity> {
    this.presences.set(presenceEntity.id, presenceEntity);
    return presenceEntity;
  }

  async delete(id: string): Promise<void> {
    this.presences.delete(id);
  }
}

describe("Presences HTTP routes", () => {
  const buildApp = () => {
    const repository = new InMemoryPresenceRepository();

    const getPresencesUseCase = new GetPresencesUseCase(repository);
    const getPresenceByIdUseCase = new GetPresenceByIdUseCase(repository);
    const createPresenceUseCase = new CreatePresenceUseCase(repository);
    const deletePresenceUseCase = new DeletePresenceUseCase(repository);

    const presenceController = new PresenceController({
      getPresencesUseCase,
      getPresenceByIdUseCase,
      createPresenceUseCase,
      deletePresenceUseCase,
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

    const inscriptionControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as InscriptionController;

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
        inscriptionController: inscriptionControllerStub,
        presenceController,
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

  it("requires authentication for all presence routes", async () => {
    const app = buildApp();
    const client = request(app);

    await client.get("/api/presences").expect(401);
    await client.get("/api/presences/all").expect(401);
    await client.get("/api/presences/test-id").expect(401);
    await client
      .post("/api/presences")
      .send({ eventId: "event-1", userId: "user-1" })
      .expect(401);
    await client.delete("/api/presences/test-id").expect(401);
  });

  it("creates, retrieves and deletes presences with authentication", async () => {
    const repository = new InMemoryPresenceRepository();
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

    const getPresencesUseCase = new GetPresencesUseCase(repository);
    const getPresenceByIdUseCase = new GetPresenceByIdUseCase(repository);
    const createPresenceUseCase = new CreatePresenceUseCase(repository);
    const deletePresenceUseCase = new DeletePresenceUseCase(repository);

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

    const presenceController = new PresenceController({
      getPresencesUseCase,
      getPresenceByIdUseCase,
      createPresenceUseCase,
      deletePresenceUseCase,
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

    const inscriptionControllerStub = {
      list: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as InscriptionController;

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
        inscriptionController: inscriptionControllerStub,
        presenceController,
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
      .get("/api/presences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(initialResponse.body.results).toEqual([]);

    const createPayload = {
      eventId: "event-1",
      userId: "user-1",
    };

    const createResponse = await client
      .post("/api/presences")
      .set("Authorization", `Bearer ${token}`)
      .send(createPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      eventId: createPayload.eventId,
      userId: createPayload.userId,
    });
    expect(typeof createResponse.body.id).toBe("string");

    const createdId: string = createResponse.body.id;

    const getByIdResponse = await client
      .get(`/api/presences/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(getByIdResponse.body).toMatchObject({
      id: createdId,
      eventId: createPayload.eventId,
      userId: createPayload.userId,
    });

    await client
      .delete(`/api/presences/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const listAfterDeletion = await client
      .get("/api/presences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(listAfterDeletion.body.results).toEqual([]);
  });
});

