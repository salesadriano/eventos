import { InscriptionEntity } from "../../src/domain/entities/InscriptionEntity";
import { InscriptionRepository } from "../../src/domain/repositories/InscriptionRepository";
import { AsyncMock } from "../utils/AsyncMock";

export class InscriptionRepositoryStub extends InscriptionRepository {
  readonly findAllMock = new AsyncMock<[], InscriptionEntity[]>([]);
  readonly findByIdMock = new AsyncMock<[string], InscriptionEntity | null>(
    null
  );
  readonly findByEventAndUserMock = new AsyncMock<
    [string, string, string?],
    InscriptionEntity | null
  >(null);
  readonly createMock = new AsyncMock<[InscriptionEntity], InscriptionEntity>(
    InscriptionEntity.create({ eventId: "event", userId: "user" })
  );
  readonly updateMock = new AsyncMock<
    [string, InscriptionEntity],
    InscriptionEntity
  >(InscriptionEntity.create({ eventId: "event", userId: "user" }));
  readonly deleteMock = new AsyncMock<[string], void>(undefined);

  async findAll(): Promise<InscriptionEntity[]> {
    return this.findAllMock.invoke();
  }

  async findById(id: string): Promise<InscriptionEntity | null> {
    return this.findByIdMock.invoke(id);
  }

  async findByEventAndUser(
    eventId: string,
    userId: string,
    activityId?: string
  ): Promise<InscriptionEntity | null> {
    return this.findByEventAndUserMock.invoke(eventId, userId, activityId);
  }

  async create(
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    return this.createMock.invoke(inscriptionEntity);
  }

  async update(
    id: string,
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    return this.updateMock.invoke(id, inscriptionEntity);
  }

  async delete(id: string): Promise<void> {
    await this.deleteMock.invoke(id);
  }
}
