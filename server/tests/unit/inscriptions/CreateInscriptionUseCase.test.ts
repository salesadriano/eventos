/// <reference types="jest" />

import { CreateInscriptionUseCase } from "../../../src/application/usecases/inscriptions/CreateInscriptionUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../src/domain/repositories/InscriptionRepository";

class InscriptionRepositoryStub extends InscriptionRepository {
  findAll = jest.fn();
  findById = jest.fn();
  findByEventAndUser = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe("CreateInscriptionUseCase", () => {
  it("creates a new inscription", async () => {
    const repository = new InscriptionRepositoryStub();
    const inscription = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
      status: "pending",
    });
    repository.findByEventAndUser.mockResolvedValue(null);
    repository.findById.mockResolvedValue(null);
    repository.create.mockResolvedValue(inscription);

    const useCase = new CreateInscriptionUseCase(repository);

    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      status: "pending",
    });

    expect(result).toEqual(inscription);
    expect(repository.findByEventAndUser).toHaveBeenCalledWith(
      "event-1",
      "user-1"
    );
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("throws error if inscription already exists for event and user", async () => {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
    });
    repository.findByEventAndUser.mockResolvedValue(existing);

    const useCase = new CreateInscriptionUseCase(repository);

    await expect(
      useCase.execute({
        eventId: "event-1",
        userId: "user-1",
      })
    ).rejects.toThrow(ValidationError);

    expect(repository.create).not.toHaveBeenCalled();
  });
});

