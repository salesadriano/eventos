import { EventEntity } from "../../src/domain/entities/EventEntity";
import { EventRepository } from "../../src/domain/repositories/EventRepository";
import { AsyncMock } from "../utils/AsyncMock";

export class EventRepositoryStub extends EventRepository {
  readonly findAllMock = new AsyncMock<[], EventEntity[]>([]);
  readonly findByIdMock = new AsyncMock<[string], EventEntity | null>(null);
  readonly createMock = new AsyncMock<[EventEntity], EventEntity>(
    EventEntity.create({
      title: "temp",
      location: "temp",
      date: new Date(),
      inscriptionInit: new Date(),
      inscriptionFinal: new Date(),
      dateInit: new Date(),
      dateFinal: new Date(),
    })
  );
  readonly updateMock = new AsyncMock<[string, EventEntity], EventEntity>(
    EventEntity.create({
      title: "temp",
      location: "temp",
      date: new Date(),
      inscriptionInit: new Date(),
      inscriptionFinal: new Date(),
      dateInit: new Date(),
      dateFinal: new Date(),
    })
  );
  readonly deleteMock = new AsyncMock<[string], void>(undefined);

  async findAll(): Promise<EventEntity[]> {
    return this.findAllMock.invoke();
  }

  async findById(id: string): Promise<EventEntity | null> {
    return this.findByIdMock.invoke(id);
  }

  async create(eventEntity: EventEntity): Promise<EventEntity> {
    return this.createMock.invoke(eventEntity);
  }

  async update(id: string, eventEntity: EventEntity): Promise<EventEntity> {
    return this.updateMock.invoke(id, eventEntity);
  }

  async delete(id: string): Promise<void> {
    await this.deleteMock.invoke(id);
  }
}
