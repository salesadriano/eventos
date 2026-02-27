import { expect } from "chai";
import { EvaluateCertificateEligibilityUseCase } from "../../../src/application/usecases/certificates/EvaluateCertificateEligibilityUseCase";
import { InscriptionEntity } from "../../../src/domain/entities/InscriptionEntity";
import { PresenceEntity } from "../../../src/domain/entities/PresenceEntity";
import { InscriptionRepositoryStub } from "../../stubs/InscriptionRepositoryStub";
import { PresenceRepositoryStub } from "../../stubs/PresenceRepositoryStub";

export const evaluateCertificateEligibilityUseCaseSpecs = {
  async returnsEligibleWhenUserHasConfirmedInscriptionAndPresence(): Promise<void> {
    const inscriptionRepository = new InscriptionRepositoryStub();
    const presenceRepository = new PresenceRepositoryStub();

    inscriptionRepository.findByEventAndUserMock.resolveWith(
      InscriptionEntity.create({
        eventId: "event-1",
        userId: "user-1",
        status: "confirmed",
      })
    );

    presenceRepository.findByEventMock.resolveWith([
      PresenceEntity.create({
        eventId: "event-1",
        userId: "user-1",
      }),
    ]);

    const useCase = new EvaluateCertificateEligibilityUseCase(
      inscriptionRepository,
      presenceRepository
    );

    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
    });

    expect(result.eligible).to.equal(true);
    expect(result.reason).to.equal(undefined);
  },

  async returnsIneligibleWhenActivityPresenceIsMissing(): Promise<void> {
    const inscriptionRepository = new InscriptionRepositoryStub();
    const presenceRepository = new PresenceRepositoryStub();

    inscriptionRepository.findByEventAndUserMock.resolveWith(
      InscriptionEntity.create({
        eventId: "event-1",
        userId: "user-1",
        status: "confirmed",
        activityId: "activity-1",
      })
    );

    presenceRepository.findByEventMock.resolveWith([
      PresenceEntity.create({
        eventId: "event-1",
        userId: "user-1",
        activityId: "activity-2",
      }),
    ]);

    const useCase = new EvaluateCertificateEligibilityUseCase(
      inscriptionRepository,
      presenceRepository
    );

    const result = await useCase.execute({
      eventId: "event-1",
      userId: "user-1",
      activityId: "activity-1",
    });

    expect(result.eligible).to.equal(false);
    expect(result.reason).to.equal("Presence not found");
  },
};
