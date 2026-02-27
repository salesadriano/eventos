import {
  EvaluateCertificateEligibilityUseCase,
  type EvaluateCertificateEligibilityPayload,
} from "./EvaluateCertificateEligibilityUseCase";

export interface EvaluateCertificateBatchPayload {
  eventId: string;
  userIds: string[];
  activityId?: string;
}

export interface EvaluateCertificateBatchResult {
  eligibleUserIds: string[];
  ineligible: Array<{ userId: string; reason: string }>;
}

export class EvaluateCertificateBatchUseCase {
  constructor(
    private readonly evaluateCertificateEligibilityUseCase: EvaluateCertificateEligibilityUseCase
  ) {}

  async execute(
    payload: EvaluateCertificateBatchPayload
  ): Promise<EvaluateCertificateBatchResult> {
    const eligibleUserIds: string[] = [];
    const ineligible: Array<{ userId: string; reason: string }> = [];

    for (const userId of payload.userIds) {
      const eligibilityPayload: EvaluateCertificateEligibilityPayload = {
        eventId: payload.eventId,
        userId,
        activityId: payload.activityId,
      };

      const result = await this.evaluateCertificateEligibilityUseCase.execute(
        eligibilityPayload
      );

      if (result.eligible) {
        eligibleUserIds.push(userId);
      } else {
        ineligible.push({ userId, reason: result.reason ?? "Not eligible" });
      }
    }

    return {
      eligibleUserIds,
      ineligible,
    };
  }
}
