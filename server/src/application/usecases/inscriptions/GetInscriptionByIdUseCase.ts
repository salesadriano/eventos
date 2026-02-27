import { InscriptionEntity } from "../../../domain/entities/InscriptionEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";

export class GetInscriptionByIdUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository
  ) {}

  async execute(id: string): Promise<InscriptionEntity> {
    const inscription = await this.inscriptionRepository.findById(id);

    if (!inscription) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    return inscription;
  }
}

