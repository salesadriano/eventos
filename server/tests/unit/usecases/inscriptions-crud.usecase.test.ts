import { CreateInscriptionUseCase } from "../../../src/application/usecases/inscriptions/CreateInscriptionUseCase";
import { DeleteInscriptionUseCase } from "../../../src/application/usecases/inscriptions/DeleteInscriptionUseCase";
import { GetInscriptionByIdUseCase } from "../../../src/application/usecases/inscriptions/GetInscriptionByIdUseCase";
import { UpdateInscriptionUseCase } from "../../../src/application/usecases/inscriptions/UpdateInscriptionUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import {
  NotFoundError,
  ValidationError,
} from "../../../src/domain/errors/ApplicationError";
import { InscriptionRepositoryStub } from "../../../tests-cypress/stubs/InscriptionRepositoryStub";
import { expectAsyncError } from "../utils/expectError";

describe("Inscriptions use cases (migrated from tests-cypress)", () => {
  it("creates inscription when no duplicate exists", async () => {
    const repository = new InscriptionRepositoryStub();
    const created = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
      status: "pending",
    });

    repository.findByEventAndUserMock.resolveWith(null);
    repository.findByIdMock.resolveWith(null);
    repository.createMock.resolveWith(created);

    const useCase = new CreateInscriptionUseCase(repository);
    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
      status: "pending",
    });

    expect(result).toEqual(created);
    expect(repository.createMock.callCount).toBe(1);
  });

  it("throws when inscription already exists for event/user/activity", async () => {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });

    repository.findByEventAndUserMock.resolveWith(existing);

    const useCase = new CreateInscriptionUseCase(repository);
    await expectAsyncError(
      () =>
        useCase.execute({
          eventId: "event-1",
          userId: "user-1",
          activityId: "activity-1",
        }),
      ValidationError,
    );
  });

  it("gets inscription by id and throws when missing", async () => {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-2",
      userId: "user-2",
    });
    const useCase = new GetInscriptionByIdUseCase(repository);

    repository.findByIdMock.resolveWith(existing);
    await expect(useCase.execute(existing.id)).resolves.toEqual(existing);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  });

  it("updates inscription and throws when missing", async () => {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-3",
      userId: "user-3",
      status: "pending",
    });

    repository.findByIdMock.resolveWith(existing);
    repository.updateMock.implement(async (_id, inscription) => inscription);

    const useCase = new UpdateInscriptionUseCase(repository);
    const updated = await useCase.execute(existing.id, { status: "confirmed" });

    expect(updated.id).toBe(existing.id);
    expect(updated.status).toBe("confirmed");

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(
      () => useCase.execute("missing", { status: "cancelled" }),
      NotFoundError,
    );
  });

  it("deletes inscription and throws when missing", async () => {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-4",
      userId: "user-4",
    });
    const useCase = new DeleteInscriptionUseCase(repository);

    repository.findByIdMock.resolveWith(existing);
    await useCase.execute(existing.id);
    expect(repository.deleteMock.callCount).toBe(1);

    repository.findByIdMock.resolveWith(null);
    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
  });
});