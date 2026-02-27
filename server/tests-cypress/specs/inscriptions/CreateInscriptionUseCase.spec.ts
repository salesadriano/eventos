import { expect } from "chai";
import { CreateInscriptionUseCase } from "../../../src/application/usecases/inscriptions/CreateInscriptionUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { InscriptionRepositoryStub } from "../../stubs/InscriptionRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const createInscriptionUseCaseSpecs = {
  async createsInscription(): Promise<void> {
    const repository = new InscriptionRepositoryStub();
    const inscription = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
      status: "pending",
    });

    repository.findByEventAndUserMock.resolveWith(null);
    repository.findByIdMock.resolveWith(null);
    repository.createMock.resolveWith(inscription);

    const useCase = new CreateInscriptionUseCase(repository);
    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      status: "pending",
    });

    expect(result).to.equal(inscription);
    expect(repository.findByEventAndUserMock.calls[0]).to.deep.equal([
      "event-1",
      "user-1",
    ]);
    expect(repository.createMock.callCount).to.equal(1);
  },

  async throwsWhenDuplicate(): Promise<void> {
    const repository = new InscriptionRepositoryStub();
    const existing = InscriptionEntity.create({
      eventId: "event-1",
      userId: "user-1",
    });

    repository.findByEventAndUserMock.resolveWith(existing);

    const useCase = new CreateInscriptionUseCase(repository);

    await expectAsyncError(
      () =>
        useCase.execute({
          eventId: "event-1",
          userId: "user-1",
        }),
      ValidationError
    );
    expect(repository.createMock.callCount).to.equal(0);
  },
};
