import { SpeakerEntity } from "../../../src/domain/entities/speakers/SpeakerEntity";
import { SpeakerRepository } from "../../../src/domain/repositories/speakers/SpeakerRepository";
import { AsyncMock } from "../../utils/AsyncMock";

export class SpeakerRepositoryStub extends SpeakerRepository {
  readonly findByIdMock = new AsyncMock<[string], SpeakerEntity | null>(null);
  readonly findByEmailMock = new AsyncMock<[string], SpeakerEntity | null>(null);
  readonly createMock = new AsyncMock<[SpeakerEntity], SpeakerEntity>(
    SpeakerEntity.create({ name: "Speaker", email: "speaker@example.com" })
  );
  readonly updateMock = new AsyncMock<[string, SpeakerEntity], SpeakerEntity>(
    SpeakerEntity.create({ name: "Speaker", email: "speaker@example.com" })
  );

  async findById(id: string): Promise<SpeakerEntity | null> {
    return this.findByIdMock.invoke(id);
  }

  async findByEmail(email: string): Promise<SpeakerEntity | null> {
    return this.findByEmailMock.invoke(email);
  }

  async create(speaker: SpeakerEntity): Promise<SpeakerEntity> {
    return this.createMock.invoke(speaker);
  }

  async update(id: string, speaker: SpeakerEntity): Promise<SpeakerEntity> {
    return this.updateMock.invoke(id, speaker);
  }
}
