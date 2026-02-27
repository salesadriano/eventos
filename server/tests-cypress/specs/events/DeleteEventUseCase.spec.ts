import { expect } from "chai";
import { DeleteEventUseCase } from "../../../src/application/usecases/events/DeleteEventUseCase";
import { EventEntity } from "../../../src/domain/entities/EventEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { EventRepositoryStub } from "../../stubs/EventRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const deleteEventUseCaseSpecs = {
  async deletesExistingEvent(): Promise<void> {
    const repository = new EventRepositoryStub();
    const event = EventEntity.create({
      title: "Delete me",
      location: "Delete location",
      date: new Date(),
      inscriptionInit: new Date(),
      inscriptionFinal: new Date(),
      dateInit: new Date(),
      dateFinal: new Date(),
    });

    repository.findByIdMock.resolveWith(event);

    const useCase = new DeleteEventUseCase(repository);
    await useCase.execute(event.id);

    expect(repository.findByIdMock.calls[0][0]).to.equal(event.id);
    expect(repository.deleteMock.calls[0][0]).to.equal(event.id);
  },

  async throwsWhenMissing(): Promise<void> {
    const repository = new EventRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new DeleteEventUseCase(repository);

    await expectAsyncError(() => useCase.execute("missing"), NotFoundError);
    expect(repository.deleteMock.callCount).to.equal(0);
  },
};
