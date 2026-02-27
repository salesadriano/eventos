import { LoginUseCase } from "../application/usecases/auth/LoginUseCase";
import { ListOAuthProvidersUseCase } from "../application/usecases/auth/ListOAuthProvidersUseCase";
import { OAuthCallbackUseCase } from "../application/usecases/auth/OAuthCallbackUseCase";
import { RefreshTokenUseCase } from "../application/usecases/auth/RefreshTokenUseCase";
import { StartOAuthAuthorizationUseCase } from "../application/usecases/auth/StartOAuthAuthorizationUseCase";
import { ValidateTokenUseCase } from "../application/usecases/auth/ValidateTokenUseCase";
import { SendEmailUseCase } from "../application/usecases/email/SendEmailUseCase";
import { CreateEventUseCase } from "../application/usecases/events/CreateEventUseCase";
import { DeleteEventUseCase } from "../application/usecases/events/DeleteEventUseCase";
import { GetEventByIdUseCase } from "../application/usecases/events/GetEventByIdUseCase";
import { GetEventsUseCase } from "../application/usecases/events/GetEventsUseCase";
import { UpdateEventUseCase } from "../application/usecases/events/UpdateEventUseCase";
import { CreateInscriptionUseCase } from "../application/usecases/inscriptions/CreateInscriptionUseCase";
import { DeleteInscriptionUseCase } from "../application/usecases/inscriptions/DeleteInscriptionUseCase";
import { GetInscriptionByIdUseCase } from "../application/usecases/inscriptions/GetInscriptionByIdUseCase";
import { GetInscriptionsUseCase } from "../application/usecases/inscriptions/GetInscriptionsUseCase";
import { UpdateInscriptionUseCase } from "../application/usecases/inscriptions/UpdateInscriptionUseCase";
import { CreatePresenceUseCase } from "../application/usecases/presences/CreatePresenceUseCase";
import { DeletePresenceUseCase } from "../application/usecases/presences/DeletePresenceUseCase";
import { GetPresenceByIdUseCase } from "../application/usecases/presences/GetPresenceByIdUseCase";
import { GetPresencesUseCase } from "../application/usecases/presences/GetPresencesUseCase";
import { CreateUserUseCase } from "../application/usecases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "../application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../application/usecases/users/GetUserByIdUseCase";
import { GetUsersUseCase } from "../application/usecases/users/GetUsersUseCase";
import { UpdateUserUseCase } from "../application/usecases/users/UpdateUserUseCase";
import { environment } from "../config/environment";
import type { IMailClient } from "../domain/repositories/IMailClient";
import { JwtService } from "../infrastructure/auth/JwtService";
import { OAuthStateStore } from "../infrastructure/auth/OAuthStateStore";
import { PasswordService } from "../infrastructure/auth/PasswordService";
import { TokenHashService } from "../infrastructure/auth/TokenHashService";
import { GoogleOAuthProviderClient } from "../infrastructure/auth/providers/GoogleOAuthProviderClient";
import type { OAuthProviderClient } from "../infrastructure/auth/providers/OAuthProviderClient";
import { OAuthProviderRegistry } from "../infrastructure/auth/providers/OAuthProviderRegistry";
import { GoogleSheetsClient } from "../infrastructure/google/GoogleSheetsClient";
import { SmtpMailClient } from "../infrastructure/mail/SmtpMailClient";
import { GoogleSheetsEventRepository } from "../infrastructure/repositories/GoogleSheetsEventRepository";
import { GoogleSheetsInscriptionRepository } from "../infrastructure/repositories/GoogleSheetsInscriptionRepository";
import { GoogleSheetsPresenceRepository } from "../infrastructure/repositories/GoogleSheetsPresenceRepository";
import { GoogleSheetsUserRepository } from "../infrastructure/repositories/GoogleSheetsUserRepository";
import { AuthController } from "../presentation/http/controllers/AuthController";
import { EmailController } from "../presentation/http/controllers/EmailController";
import { EventController } from "../presentation/http/controllers/EventController";
import { InscriptionController } from "../presentation/http/controllers/InscriptionController";
import { LegacySheetsController } from "../presentation/http/controllers/LegacySheetsController";
import { PresenceController } from "../presentation/http/controllers/PresenceController";
import { UserController } from "../presentation/http/controllers/UserController";

export interface ApplicationContainer {
  controllers: {
    authController: AuthController;
    eventController: EventController;
    userController: UserController;
    inscriptionController: InscriptionController;
    presenceController: PresenceController;
    legacySheetsController: LegacySheetsController;
    emailController: EmailController;
  };
}

export const buildContainer = async (): Promise<ApplicationContainer> => {
  const googleSheetsClient = new GoogleSheetsClient(environment.googleSheets);

  const eventRepository = new GoogleSheetsEventRepository(googleSheetsClient, {
    range: environment.googleSheets.ranges.events,
  });

  // Initialize event sheet (create if needed, validate/update headers)
  try {
    await eventRepository.initialize();
  } catch (error) {
    console.error("Failed to initialize events sheet:", error);
    throw error;
  }

  const getEventsUseCase = new GetEventsUseCase(eventRepository);
  const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
  const createEventUseCase = new CreateEventUseCase(eventRepository);
  const updateEventUseCase = new UpdateEventUseCase(eventRepository);
  const deleteEventUseCase = new DeleteEventUseCase(eventRepository);

  const userRepository = new GoogleSheetsUserRepository(googleSheetsClient, {
    range: environment.googleSheets.ranges.users,
  });

  // Initialize user sheet (create if needed, validate/update headers)
  try {
    await userRepository.initialize();
  } catch (error) {
    console.error("Failed to initialize users sheet:", error);
    throw error;
  }

  const passwordService = new PasswordService();
  const jwtService = new JwtService(environment.jwt);
  const tokenHashService = new TokenHashService(environment.jwt.secret);
  const oauthStateStore = new OAuthStateStore(environment.oauth.stateTtlSeconds);
  const oauthProviders = new Map<string, OAuthProviderClient>();

  if (environment.oauth.providers.google) {
    oauthProviders.set(
      "google",
      new GoogleOAuthProviderClient(environment.oauth.providers.google)
    );
  }

  const oauthProviderRegistry = new OAuthProviderRegistry(oauthProviders);

  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    passwordService
  );
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordService,
    jwtService,
    tokenHashService
  );
  const refreshTokenUseCase = new RefreshTokenUseCase(
    userRepository,
    jwtService,
    tokenHashService
  );
  const validateTokenUseCase = new ValidateTokenUseCase(
    userRepository,
    jwtService
  );
  const listOAuthProvidersUseCase = new ListOAuthProvidersUseCase(
    oauthProviderRegistry
  );
  const startOAuthAuthorizationUseCase = new StartOAuthAuthorizationUseCase(
    oauthProviderRegistry,
    oauthStateStore
  );
  const oauthCallbackUseCase = new OAuthCallbackUseCase(
    userRepository,
    oauthProviderRegistry,
    oauthStateStore,
    jwtService,
    tokenHashService
  );

  const authController = new AuthController({
    loginUseCase,
    refreshTokenUseCase,
    validateTokenUseCase,
    listOAuthProvidersUseCase,
    startOAuthAuthorizationUseCase,
    oauthCallbackUseCase,
  });

  const eventController = new EventController({
    getEventsUseCase,
    getEventByIdUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase,
  });

  const userController = new UserController({
    getUsersUseCase,
    getUserByIdUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  });

  const inscriptionRepository = new GoogleSheetsInscriptionRepository(
    googleSheetsClient,
    {
      range: environment.googleSheets.ranges.inscriptions,
    }
  );

  // Initialize inscription sheet (create if needed, validate/update headers)
  try {
    await inscriptionRepository.initialize();
  } catch (error) {
    console.error("Failed to initialize inscriptions sheet:", error);
    throw error;
  }

  const getInscriptionsUseCase = new GetInscriptionsUseCase(
    inscriptionRepository
  );
  const getInscriptionByIdUseCase = new GetInscriptionByIdUseCase(
    inscriptionRepository
  );
  const createInscriptionUseCase = new CreateInscriptionUseCase(
    inscriptionRepository
  );
  const updateInscriptionUseCase = new UpdateInscriptionUseCase(
    inscriptionRepository
  );
  const deleteInscriptionUseCase = new DeleteInscriptionUseCase(
    inscriptionRepository
  );

  const inscriptionController = new InscriptionController({
    getInscriptionsUseCase,
    getInscriptionByIdUseCase,
    createInscriptionUseCase,
    updateInscriptionUseCase,
    deleteInscriptionUseCase,
  });

  const presenceRepository = new GoogleSheetsPresenceRepository(
    googleSheetsClient,
    {
      range: environment.googleSheets.ranges.presences,
    }
  );

  // Initialize presence sheet (create if needed, validate/update headers)
  try {
    await presenceRepository.initialize();
  } catch (error) {
    console.error("Failed to initialize presences sheet:", error);
    throw error;
  }

  const getPresencesUseCase = new GetPresencesUseCase(presenceRepository);
  const getPresenceByIdUseCase = new GetPresenceByIdUseCase(presenceRepository);
  const createPresenceUseCase = new CreatePresenceUseCase(presenceRepository);
  const deletePresenceUseCase = new DeletePresenceUseCase(presenceRepository);

  const presenceController = new PresenceController({
    getPresencesUseCase,
    getPresenceByIdUseCase,
    createPresenceUseCase,
    deletePresenceUseCase,
  });

  const legacySheetsController = new LegacySheetsController({
    getEventsUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase,
    googleSheetsClient,
  });

  const emailController = environment.smtp
    ? (() => {
        const smtpMailClient = new SmtpMailClient(environment.smtp);
        const sendEmailUseCase = new SendEmailUseCase(smtpMailClient);
        return new EmailController({
          sendEmailUseCase,
        });
      })()
    : (() => {
        const disabledMailClient: IMailClient = {
          async send() {
            throw new Error(
              "Email service is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables."
            );
          },
        };

        return new EmailController({
          sendEmailUseCase: new SendEmailUseCase(disabledMailClient),
        });
      })();

  return {
    controllers: {
      authController,
      eventController,
      userController,
      inscriptionController,
      presenceController,
      legacySheetsController,
      emailController,
    },
  };
};
