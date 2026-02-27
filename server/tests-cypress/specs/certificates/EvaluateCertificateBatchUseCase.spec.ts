import { expect } from "chai";
import { EvaluateCertificateBatchUseCase } from "../../../src/application/usecases/certificates/EvaluateCertificateBatchUseCase";
import { EvaluateCertificateEligibilityUseCase } from "../../../src/application/usecases/certificates/EvaluateCertificateEligibilityUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { InscriptionRepositoryStub } from "../../stubs/InscriptionRepositoryStub";
import { PresenceRepositoryStub } from "../../stubs/PresenceRepositoryStub";

export const evaluateCertificateBatchUseCaseSpecs = {
  async splitsEligibleAndIneligibleUsers(): Promise<void> {
    const inscriptionRepository = new InscriptionRepositoryStub();
    const presenceRepository = new PresenceRepositoryStub();

    inscriptionRepository.findByEventAndUserMock.implement(async (eventId, userId) => {
      if (eventId === "event-1" && userId === "user-1") {
        return InscriptionEntity.create({
          eventId,
          userId,
          status: "confirmed",
        });
      }

      return null;
    });

    presenceRepository.findByEventMock.resolveWith([
      PresenceEntity.create({
        eventId: "event-1",
        userId: "user-1",
      }),
    ]);

    const eligibilityUseCase = new EvaluateCertificateEligibilityUseCase(
      inscriptionRepository,
      presenceRepository
    );

    const useCase = new EvaluateCertificateBatchUseCase(eligibilityUseCase);

    const result = await useCase.execute({
      eventId: "event-1",
      userIds: ["user-1", "user-2"],
    });

    expect(result.eligibleUserIds).to.deep.equal(["user-1"]);
    expect(result.ineligible).to.have.length(1);
    expect(result.ineligible[0]).to.deep.equal({
      userId: "user-2",
      reason: "Inscription not found",
    });
  },
};
