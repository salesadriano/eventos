import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";

export class DeleteInscriptionUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.inscriptionRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    await this.inscriptionRepository.delete(id);
  }
}

