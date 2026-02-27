import { expect } from "chai";
import { CreateSpeakerUseCase } from "../../../src/application/usecases/speakers/CreateSpeakerUseCase";
import { SpeakerEntity } from "../../../src/domain/entities/speakers/SpeakerEntity";
import { ValidationError } from "../../../src/domain/errors/ApplicationError";
import { SpeakerRepositoryStub } from "../../stubs/speakers/SpeakerRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const createSpeakerUseCaseSpecs = {
  async createsSpeakerWhenEmailIsUnique(): Promise<void> {
    const repository = new SpeakerRepositoryStub();
    repository.findByEmailMock.resolveWith(null);

    const created = SpeakerEntity.create({
      name: "Speaker One",
      email: "speaker.one@example.com",
    });

    repository.createMock.resolveWith(created);

    const useCase = new CreateSpeakerUseCase(repository);
    const result = await useCase.execute({
      name: "Speaker One",
      email: "speaker.one@example.com",
    });

    expect(result).to.equal(created);
    expect(repository.createMock.callCount).to.equal(1);
  },

  async throwsWhenEmailAlreadyExists(): Promise<void> {
    const repository = new SpeakerRepositoryStub();
    repository.findByEmailMock.resolveWith(
      SpeakerEntity.create({ name: "Existing", email: "existing@example.com" })
    );

    const useCase = new CreateSpeakerUseCase(repository);

    await expectAsyncError(
      () => useCase.execute({ name: "Existing", email: "existing@example.com" }),
      ValidationError
    );
  },
};
