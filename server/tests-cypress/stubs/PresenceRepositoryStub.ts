import { PresenceEntity } from "../../src/domain/entities/PresenceEntity";
import { PresenceRepository } from "../../src/domain/repositories/PresenceRepository";
import { AsyncMock } from "../utils/AsyncMock";

export class PresenceRepositoryStub extends PresenceRepository {
  readonly findAllMock = new AsyncMock<[], PresenceEntity[]>([]);
  readonly findByIdMock = new AsyncMock<[string], PresenceEntity | null>(null);
  readonly findByEventMock = new AsyncMock<[string], PresenceEntity[]>([]);
  readonly createMock = new AsyncMock<[PresenceEntity], PresenceEntity>(
    PresenceEntity.create({
      eventId: "event",
      userId: "user",
      status: "pending",
    })
  );
  readonly deleteMock = new AsyncMock<[string], void>(undefined);

  async findAll(): Promise<PresenceEntity[]> {
    return this.findAllMock.invoke();
  }

  async findById(id: string): Promise<PresenceEntity | null> {
    return this.findByIdMock.invoke(id);
  }

  async findByEvent(eventId: string): Promise<PresenceEntity[]> {
    return this.findByEventMock.invoke(eventId);
  }

  async create(presenceEntity: PresenceEntity): Promise<PresenceEntity> {
    return this.createMock.invoke(presenceEntity);
  }

  async delete(id: string): Promise<void> {
    await this.deleteMock.invoke(id);
  }
}
