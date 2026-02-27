import { refreshTokenUseCaseSpecs } from "./specs/auth/RefreshTokenUseCase.spec";
import { startOAuthAuthorizationUseCaseSpecs } from "./specs/auth/StartOAuthAuthorizationUseCase.spec";
import { evaluateCertificateBatchUseCaseSpecs } from "./specs/certificates/EvaluateCertificateBatchUseCase.spec";
import { evaluateCertificateEligibilityUseCaseSpecs } from "./specs/certificates/EvaluateCertificateEligibilityUseCase.spec";
import { createEventUseCaseSpecs } from "./specs/events/CreateEventUseCase.spec";
import { deleteEventUseCaseSpecs } from "./specs/events/DeleteEventUseCase.spec";
import { getEventByIdUseCaseSpecs } from "./specs/events/GetEventByIdUseCase.spec";
import { getEventsUseCaseSpecs } from "./specs/events/GetEventsUseCase.spec";
import { updateEventUseCaseSpecs } from "./specs/events/UpdateEventUseCase.spec";
import { createInscriptionUseCaseSpecs } from "./specs/inscriptions/CreateInscriptionUseCase.spec";
import { getInscriptionsUseCaseSpecs } from "./specs/inscriptions/GetInscriptionsUseCase.spec";
import { createPresenceUseCaseSpecs } from "./specs/presences/CreatePresenceUseCase.spec";
import { getPresencesUseCaseSpecs } from "./specs/presences/GetPresencesUseCase.spec";
import { createUserUseCaseSpecs } from "./specs/users/CreateUserUseCase.spec";
import { deleteUserUseCaseSpecs } from "./specs/users/DeleteUserUseCase.spec";
import { getUserByIdUseCaseSpecs } from "./specs/users/GetUserByIdUseCase.spec";
import { getUsersUseCaseSpecs } from "./specs/users/GetUsersUseCase.spec";
import { updateUserUseCaseSpecs } from "./specs/users/UpdateUserUseCase.spec";

type SpecMap = Record<string, () => Promise<void> | void>;

const suites: Record<string, SpecMap> = {
  RefreshTokenUseCase: refreshTokenUseCaseSpecs,
  StartOAuthAuthorizationUseCase: startOAuthAuthorizationUseCaseSpecs,
  EvaluateCertificateEligibilityUseCase: evaluateCertificateEligibilityUseCaseSpecs,
  EvaluateCertificateBatchUseCase: evaluateCertificateBatchUseCaseSpecs,
  CreateEventUseCase: createEventUseCaseSpecs,
  DeleteEventUseCase: deleteEventUseCaseSpecs,
  GetEventByIdUseCase: getEventByIdUseCaseSpecs,
  GetEventsUseCase: getEventsUseCaseSpecs,
  UpdateEventUseCase: updateEventUseCaseSpecs,
  CreateUserUseCase: createUserUseCaseSpecs,
  DeleteUserUseCase: deleteUserUseCaseSpecs,
  GetUserByIdUseCase: getUserByIdUseCaseSpecs,
  GetUsersUseCase: getUsersUseCaseSpecs,
  UpdateUserUseCase: updateUserUseCaseSpecs,
  CreateInscriptionUseCase: createInscriptionUseCaseSpecs,
  GetInscriptionsUseCase: getInscriptionsUseCaseSpecs,
  CreatePresenceUseCase: createPresenceUseCaseSpecs,
  GetPresencesUseCase: getPresencesUseCaseSpecs,
};

async function run(): Promise<void> {
  let total = 0;
  let failures = 0;

  for (const [suiteName, specMap] of Object.entries(suites)) {
    console.log(`\n${suiteName}`);

    for (const [specName, specFn] of Object.entries(specMap)) {
      total += 1;

      try {
        await specFn();
        console.log(`  ✓ ${specName}`);
      } catch (error) {
        failures += 1;
        console.error(`  ✖ ${specName}`);
        console.error(error);
      }
    }
  }

  console.log(`\nTotal: ${total}, Falhas: ${failures}`);

  if (failures > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
