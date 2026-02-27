import { UnauthorizedError } from "../../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";
import { PresenceRepository } from "../../../domain/repositories/PresenceRepository";

export interface EvaluateCertificateEligibilityPayload {
  eventId: string;
  userId: string;
  activityId?: string;
}

export interface CertificateEligibilityResult {
  eligible: boolean;
  reason?: string;
}

export class EvaluateCertificateEligibilityUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly presenceRepository: PresenceRepository
  ) {}

  async execute(
    payload: EvaluateCertificateEligibilityPayload
  ): Promise<CertificateEligibilityResult> {
    const inscription = await this.inscriptionRepository.findByEventAndUser(
      payload.eventId,
      payload.userId,
      payload.activityId
    );

    if (!inscription) {
      return { eligible: false, reason: "Inscription not found" };
    }

    if (inscription.status === "cancelled") {
      return { eligible: false, reason: "Inscription cancelled" };
    }

    const presences = await this.presenceRepository.findByEvent(payload.eventId);

    const hasPresence = presences.some(
      (presence) =>
        presence.userId === payload.userId &&
        (payload.activityId
          ? (presence.activityId || "") === payload.activityId
          : true)
    );

    if (!hasPresence) {
      return { eligible: false, reason: "Presence not found" };
    }

    if (payload.activityId) {
      const inscriptionActivity = inscription.activityId || "";
      if (inscriptionActivity.length > 0 && inscriptionActivity !== payload.activityId) {
        return {
          eligible: false,
          reason: "Inscription is not valid for requested activity",
        };
      }
    }

    return { eligible: true };
  }

  async assertEligible(
    payload: EvaluateCertificateEligibilityPayload
  ): Promise<void> {
    const result = await this.execute(payload);

    if (!result.eligible) {
      throw new UnauthorizedError(result.reason ?? "User is not eligible");
    }
  }
}
