import { generateUUID } from "../../shared/utils/generateUUID";
import { ValidationError } from "../errors/ApplicationError";

export type OAuthProviderType =
  | "google"
  | "microsoft"
  | "github"
  | "apple"
  | "linkedin"
  | "meta";

/**
 * FederatedIdentityEntity - Representa um vínculo entre uma identidade externa (OIDC/OAuth)
 * e uma conta local do usuário.
 *
 * Este vínculo é imutável uma vez criado e registra:
 * - Qúem autenticou (provider + subject)
 * - Quando foi vinculado
 * - Estado de validação (emailVerified)
 *
 * Regra de negócio (RN-UC002-02): Identidade federada deve ser única por provedor + subject
 */
export interface FederatedIdentityCreateProps {
  id?: string;
  userId: string;
  provider: OAuthProviderType;
  subject: string; // ID único do usuário no provedor (sub claim)
  email?: string;
  name?: string;
  emailVerified?: boolean;
}

export interface FederatedIdentityPrimitive {
  id: string;
  userId: string;
  provider: OAuthProviderType;
  subject: string;
  email?: string;
  name?: string;
  emailVerified: boolean;
  linkedAt: Date;
}

/**
 * FederatedIdentityEntity
 *
 * Invariantes:
 * - provider + subject devem ser únicos (enforçado em repository)
 * - userId não pode estar vazio
 * - subject não pode estar vazio
 * - linkedAt é data de criação (imutável)
 */
export class FederatedIdentityEntity {
  public readonly id: string;
  public readonly userId: string;
  public readonly provider: OAuthProviderType;
  public readonly subject: string;
  public readonly email?: string;
  public readonly name?: string;
  public readonly emailVerified: boolean;
  public readonly linkedAt: Date;

  constructor({
    id,
    userId,
    provider,
    subject,
    email,
    name,
    emailVerified = false,
  }: FederatedIdentityCreateProps) {
    this.id = id ?? generateUUID();
    this.userId = userId;
    this.provider = provider;
    this.subject = subject;
    this.email = email;
    this.name = name;
    this.emailVerified = emailVerified;
    this.linkedAt = new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new ValidationError("FederatedIdentity userId is required");
    }

    if (!this.subject || this.subject.trim().length === 0) {
      throw new ValidationError("FederatedIdentity subject is required");
    }

    if (!this.provider) {
      throw new ValidationError("FederatedIdentity provider is required");
    }

    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new ValidationError("FederatedIdentity email is invalid");
    }
  }

  static create(props: FederatedIdentityCreateProps): FederatedIdentityEntity {
    return new FederatedIdentityEntity(props);
  }

  static fromPrimitives(
    primitives: FederatedIdentityPrimitive,
  ): FederatedIdentityEntity {
    return new FederatedIdentityEntity({
      id: primitives.id,
      userId: primitives.userId,
      provider: primitives.provider,
      subject: primitives.subject,
      email: primitives.email,
      name: primitives.name,
      emailVerified: primitives.emailVerified,
    });
  }

  toPrimitives(): FederatedIdentityPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      provider: this.provider,
      subject: this.subject,
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      linkedAt: this.linkedAt,
    };
  }
}
