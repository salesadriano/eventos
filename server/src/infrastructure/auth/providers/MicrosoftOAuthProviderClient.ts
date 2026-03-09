import { ValidationError } from "../../../domain/errors/ApplicationError";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "./OAuthProviderClient";

interface MicrosoftOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  tenant: string;
  scopes: string[];
}

interface MicrosoftTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface MicrosoftUserInfoResponse {
  id?: string;
  userPrincipalName?: string;
  mail?: string;
  displayName?: string;
  mailNickname?: string;
}

/**
 * MicrosoftOAuthProviderClient
 *
 * Implementação do OAuth 2.0 para Microsoft Entra ID (Azure AD).
 * Suporta contas corporativas (AD) e pessoais (Outlook/Live).
 *
 * Documentação: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
 *
 * Requisitos especiais:
 * - Escopo `offline_access` é obrigatório para receber refresh token
 * - Tenant pode ser "common" (qualquer conta) ou um GUID específico
 * - SPAs devem configurar Redirect URI como "SPA" no Azure Portal
 */
export class MicrosoftOAuthProviderClient implements OAuthProviderClient {
  readonly provider = "microsoft";
  readonly displayName = "Microsoft";

  constructor(private readonly config: MicrosoftOAuthConfig) {}

  getAuthorizationUrl(params: OAuthAuthorizationParams): string {
    const baseUrl = `${this.config.authorizationUrl}/${this.config.tenant}/oauth2/v2.0/authorize`;

    const search = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: params.redirectUri,
      scope: this.config.scopes.join(" "),
      state: params.state,
      code_challenge: params.codeChallenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    });

    return `${baseUrl}?${search.toString()}`;
  }

  async exchangeCodeForProfile(
    params: OAuthCodeExchangeParams,
  ): Promise<OAuthProviderProfile> {
    const tokenUrl = `${this.config.tokenUrl}/${this.config.tenant}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      code: params.code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code",
      code_verifier: params.codeVerifier,
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const tokenPayload = (await tokenResponse.json()) as MicrosoftTokenResponse;

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      throw new ValidationError(
        tokenPayload.error_description ||
          tokenPayload.error ||
          "OAuth token exchange failed",
      );
    }

    const userResponse = await fetch(this.config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
      },
    });

    const userPayload =
      (await userResponse.json()) as MicrosoftUserInfoResponse;

    if (!userResponse.ok || !userPayload.id) {
      throw new ValidationError("OAuth user profile resolution failed");
    }

    // Usar 'id' como subject (está sempre presente em respostas do Microsoft)
    const email = userPayload.mail || userPayload.userPrincipalName;
    const name = userPayload.displayName;

    if (!email) {
      throw new ValidationError("Microsoft profile did not provide an email");
    }

    return {
      subject: userPayload.id,
      email,
      name,
      emailVerified: true, // Microsoft OIDC tokens já vêm com e-mail verificado
    };
  }

  getDefaultRedirectUri(): string {
    return this.config.redirectUri;
  }
}
