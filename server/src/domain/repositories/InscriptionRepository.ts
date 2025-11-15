import { InscriptionEntity } from "../entities/InscriptionEntity";

export abstract class InscriptionRepository {
  abstract findAll(): Promise<InscriptionEntity[]>;
  abstract findById(id: string): Promise<InscriptionEntity | null>;
  abstract findByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<InscriptionEntity | null>;
  abstract create(
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity>;
  abstract update(
    id: string,
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity>;
  abstract delete(id: string): Promise<void>;
}
