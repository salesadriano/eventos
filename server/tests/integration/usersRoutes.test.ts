/// <reference types="jest" />

import request from "supertest";
import { createApp } from "../../src/app";
import { CreateUserUseCase } from "../../src/application/usecases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "../../src/application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../src/application/usecases/users/GetUserByIdUseCase";
import { GetUsersUseCase } from "../../src/application/usecases/users/GetUsersUseCase";
import { UpdateUserUseCase } from "../../src/application/usecases/users/UpdateUserUseCase";
import { UserEntity } from "../../src/domain/entities/UserEntity";
import { UserRepository } from "../../src/domain/repositories/UserRepository";
import { LoginUseCase } from "../../src/application/usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../src/application/usecases/auth/RefreshTokenUseCase";
import { ValidateTokenUseCase } from "../../src/application/usecases/auth/ValidateTokenUseCase";
import { PasswordService } from "../../src/infrastructure/auth/PasswordService";
import { JwtService } from "../../src/infrastructure/auth/JwtService";
import { environment } from "../../src/config/environment";
import { AuthController } from "../../src/presentation/http/controllers/AuthController";
import type { EventController } from "../../src/presentation/http/controllers/EventController";
import type { EmailController } from "../../src/presentation/http/controllers/EmailController";
import type { InscriptionController } from "../../src/presentation/http/controllers/InscriptionController";
import type { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";
import type { PresenceController } from "../../src/presentation/http/controllers/PresenceController";
import { UserController } from "../../src/presentation/http/controllers/UserController";

class InMemoryUserRepository extends UserRepository {
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
}

describe("Users HTTP routes", () => {
  const buildApp = () => {
    const repository = new InMemoryUserRepository();
    const passwordService = new PasswordService();
    const jwtService = new JwtService(environment.jwt);

    const getUsersUseCase = new GetUsersUseCase(repository);
    const getUserByIdUseCase = new GetUserByIdUseCase(repository);
    const createUserUseCase = new CreateUserUseCase(repository, passwordService);
    const updateUserUseCase = new UpdateUserUseCase(repository);
    const deleteUserUseCase = new DeleteUserUseCase(repository);

    const loginUseCase = new LoginUseCase(repository, passwordService, jwtService);
    const refreshTokenUseCase = new RefreshTokenUseCase(repository, jwtService);
    const validateTokenUseCase = new ValidateTokenUseCase(repository, jwtService);

    const userController = new UserController({
      getUsersUseCase,
      getUserByIdUseCase,
      createUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
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

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const legacySheetsControllerStub = {
      readValues: jest.fn(),
      appendValues: jest.fn(),
      updateValues: jest.fn(),
      clearValues: jest.fn(),
    } as unknown as LegacySheetsController;

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
        eventController: eventControllerStub,
        userController,
        inscriptionController: inscriptionControllerStub,
        presenceController: presenceControllerStub,
        emailController: emailControllerStub,
        legacySheetsController: legacySheetsControllerStub,
      },
    });
  };

  const createAuthenticatedUser = async (
    app: ReturnType<typeof buildApp>,
    repository: InMemoryUserRepository,
    passwordService: PasswordService
  ): Promise<{ token: string; userId: string }> => {
    // Create a test user
    const testUser = UserEntity.create({
      name: "Test User",
      email: "test@example.com",
      password: await passwordService.hash("password123"),
      profile: "user",
    });
    await repository.create(testUser);

    // Login to get token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .expect(200);

    return {
      token: loginResponse.body.accessToken,
      userId: testUser.id,
    };
  };

  it("requires authentication for all user routes", async () => {
    const app = buildApp();
    const client = request(app);

    // All routes should return 401 without authentication
    await client.get("/api/users").expect(401);
    await client.get("/api/users/all").expect(401);
    await client.get("/api/users/test-id").expect(401);
    await client.post("/api/users").send({ name: "Test", email: "test@test.com" }).expect(401);
    await client.put("/api/users/test-id").send({ name: "Test" }).expect(401);
    await client.patch("/api/users/test-id").send({ name: "Test" }).expect(401);
    await client.delete("/api/users/test-id").expect(401);
  });

  it("creates, retrieves, updates and deletes users with authentication", async () => {
    const repository = new InMemoryUserRepository();
    const passwordService = new PasswordService();
    const jwtService = new JwtService(environment.jwt);

    const getUsersUseCase = new GetUsersUseCase(repository);
    const getUserByIdUseCase = new GetUserByIdUseCase(repository);
    const createUserUseCase = new CreateUserUseCase(repository, passwordService);
    const updateUserUseCase = new UpdateUserUseCase(repository);
    const deleteUserUseCase = new DeleteUserUseCase(repository);

    const loginUseCase = new LoginUseCase(repository, passwordService, jwtService);
    const refreshTokenUseCase = new RefreshTokenUseCase(repository, jwtService);
    const validateTokenUseCase = new ValidateTokenUseCase(repository, jwtService);

    const userController = new UserController({
      getUsersUseCase,
      getUserByIdUseCase,
      createUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
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

    const emailControllerStub = {
      send: jest.fn(),
    } as unknown as EmailController;

    const legacySheetsControllerStub = {
      readValues: jest.fn(),
      appendValues: jest.fn(),
      updateValues: jest.fn(),
      clearValues: jest.fn(),
    } as unknown as LegacySheetsController;

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
        eventController: eventControllerStub,
        userController,
        inscriptionController: inscriptionControllerStub,
        presenceController: presenceControllerStub,
        emailController: emailControllerStub,
        legacySheetsController: legacySheetsControllerStub,
      },
    });

    const { token, userId } = await createAuthenticatedUser(app, repository, passwordService);
    const client = request(app);

    const initialResponse = await client
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // The authenticated user should be in the list
    expect(initialResponse.body.results.length).toBeGreaterThanOrEqual(1);

    const createPayload = {
      name: "Integration Test User",
      email: "integration.user@example.com",
      password: "password123",
      profile: "user",
    };

    const createResponse = await client
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send(createPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      name: createPayload.name,
      email: createPayload.email,
      profile: createPayload.profile,
    });
    expect(typeof createResponse.body.id).toBe("string");
    expect(typeof createResponse.body.createdAt).toBe("string");
    expect(createResponse.body.password).toBeUndefined(); // Password should not be in response

    const createdId: string = createResponse.body.id;

    const getByIdResponse = await client
      .get(`/api/users/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(getByIdResponse.body).toMatchObject({
      id: createdId,
      name: createPayload.name,
    });

    const updatePayload = {
      name: "Updated integration user",
    };

    const updateResponse = await client
      .put(`/api/users/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatePayload)
      .expect(200);

    expect(updateResponse.body.name).toBe(updatePayload.name);

    await client
      .delete(`/api/users/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const listAfterDeletion = await client
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // After deletion, only the authenticated user should remain
    expect(listAfterDeletion.body.results.length).toBe(1);
    expect(listAfterDeletion.body.results[0].id).toBe(userId);
  });
});
