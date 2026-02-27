import { expect } from "chai";
import { UpdateSpeakerUseCase } from "../../../src/application/usecases/speakers/UpdateSpeakerUseCase";
import { SpeakerEntity } from "../../../src/domain/entities/speakers/SpeakerEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { SpeakerRepositoryStub } from "../../stubs/speakers/SpeakerRepositoryStub";
import { expectAsyncError } from "../../utils/expectError";

export const updateSpeakerUseCaseSpecs = {
  async updatesSpeakerWhenExists(): Promise<void> {
    const repository = new SpeakerRepositoryStub();
    const existing = SpeakerEntity.create({
      name: "Speaker",
      email: "speaker@example.com",
      bio: "Old bio",
    });

    repository.findByIdMock.resolveWith(existing);
    repository.updateMock.implement(async (_id, speaker) => speaker);

    const useCase = new UpdateSpeakerUseCase(repository);

    const result = await useCase.execute(existing.id, {
      bio: "New bio",
    });

    expect(result.bio).to.equal("New bio");
    expect(repository.updateMock.callCount).to.equal(1);
  },

  async throwsWhenSpeakerNotFound(): Promise<void> {
    const repository = new SpeakerRepositoryStub();
    repository.findByIdMock.resolveWith(null);

    const useCase = new UpdateSpeakerUseCase(repository);

    await expectAsyncError(
      () => useCase.execute("missing", { bio: "x" }),
      NotFoundError
    );
  },
};
