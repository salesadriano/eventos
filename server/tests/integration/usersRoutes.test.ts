import request from "supertest";
import { createApp } from "../../src/app";
import { CreateUserUseCase } from "../../src/application/usecases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "../../src/application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../src/application/usecases/users/GetUserByIdUseCase";
import { GetUsersUseCase } from "../../src/application/usecases/users/GetUsersUseCase";
import { UpdateUserUseCase } from "../../src/application/usecases/users/UpdateUserUseCase";
import { UserEntity } from "../../src/domain/entities/UserEntity";
import { UserRepository } from "../../src/domain/repositories/UserRepository";
import type { EventController } from "../../src/presentation/http/controllers/EventController";
import type { LegacySheetsController } from "../../src/presentation/http/controllers/LegacySheetsController";
import { UserController } from "../../src/presentation/http/controllers/UserController";

class InMemoryUserRepository extends UserRepository {
  private readonly users = new Map<string, UserEntity>();

  async findAll(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
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

    const getUsersUseCase = new GetUsersUseCase(repository);
    const getUserByIdUseCase = new GetUserByIdUseCase(repository);
    const createUserUseCase = new CreateUserUseCase(repository);
    const updateUserUseCase = new UpdateUserUseCase(repository);
    const deleteUserUseCase = new DeleteUserUseCase(repository);

    const userController = new UserController({
      getUsersUseCase,
      getUserByIdUseCase,
      createUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
    });

    const eventControllerStub = {
      list: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as EventController;

    const legacySheetsControllerStub = {
      readValues: jest.fn(),
      appendValues: jest.fn(),
      updateValues: jest.fn(),
      clearValues: jest.fn(),
    } as unknown as LegacySheetsController;

    return createApp({
      controllers: {
        eventController: eventControllerStub,
        userController,
        legacySheetsController: legacySheetsControllerStub,
      },
    });
  };

  it("creates, retrieves, updates and deletes users", async () => {
    const app = buildApp();
    const client = request(app);

    const initialResponse = await client.get("/api/users").expect(200);
    expect(initialResponse.body).toEqual([]);

    const createPayload = {
      name: "Integration Test User",
      email: "integration.user@example.com",
    };

    const createResponse = await client
      .post("/api/users")
      .send(createPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      name: createPayload.name,
      email: createPayload.email,
    });
    expect(typeof createResponse.body.id).toBe("string");
    expect(typeof createResponse.body.createdAt).toBe("string");

    const createdId: string = createResponse.body.id;

    const getByIdResponse = await client
      .get(`/api/users/${createdId}`)
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
      .send(updatePayload)
      .expect(200);

    expect(updateResponse.body.name).toBe(updatePayload.name);

    await client.delete(`/api/users/${createdId}`).expect(204);

    const listAfterDeletion = await client.get("/api/users").expect(200);
    expect(listAfterDeletion.body).toEqual([]);
  });
});
