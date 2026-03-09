import { ValidationError } from "../../../domain/errors/ApplicationError";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "./OAuthProviderClient";

interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

interface GitHubTokenResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface GitHubUserInfoResponse {
  id?: number;
  login?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

/**
 * GitHubOAuthProviderClient
 *
 * Implementação do OAuth 2.0 para GitHub.
 * Suporta GitHub Apps (recomendado) e OAuth Apps.
 *
 * Documentação: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 *
 * Notas importantes:
 * - GitHub retorna tokens sem expiração (não implementa refresh tokens)
 * - Usar GitHub Apps é recomendado para maior segurança e granularidade
 * - Ao chamar /token, incluir header Accept: application/json
 * - Escopo "user:email" pode ser necessário para obter email privado
 */
export class GitHubOAuthProviderClient implements OAuthProviderClient {
  readonly provider = "github";
  readonly displayName = "GitHub";

  constructor(private readonly config: GitHubOAuthConfig) {}

  getAuthorizationUrl(params: OAuthAuthorizationParams): string {
    const search = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: params.redirectUri,
      scope: this.config.scopes.join(" "),
      state: params.state,
      code_challenge: params.codeChallenge,
      code_challenge_method: "S256",
      allow_signup: "true",
    });

    return `${this.config.authorizationUrl}?${search.toString()}`;
  }

  async exchangeCodeForProfile(
    params: OAuthCodeExchangeParams,
  ): Promise<OAuthProviderProfile> {
    const body = new URLSearchParams({
      code: params.code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: params.redirectUri,
    });

    const tokenResponse = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });

    const tokenPayload = (await tokenResponse.json()) as GitHubTokenResponse;

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      throw new ValidationError(
        tokenPayload.error_description ||
          tokenPayload.error ||
          "OAuth token exchange failed",
      );
    }

    // GitHub não retorna o subject via OIDC, precisamos fazer um request GET /user
    const userResponse = await fetch(this.config.userInfoUrl, {
      headers: {
        Authorization: `token ${tokenPayload.access_token}`,
        Accept: "application/json",
      },
    });

    const userPayload = (await userResponse.json()) as GitHubUserInfoResponse;

    if (!userResponse.ok || !userPayload.id) {
      throw new ValidationError("GitHub user profile resolution failed");
    }

    // GitHub usa numeric ID como subject único
    const email = userPayload.email;
    const name = userPayload.name || userPayload.login;

    if (!email && !userPayload.login) {
      throw new ValidationError(
        "GitHub profile did not provide an email or login",
      );
    }

    return {
      subject: String(userPayload.id),
      email: email || `${userPayload.login}@github.com`,
      name,
      emailVerified: Boolean(email), // Se tem email, é verificado
    };
  }

  getDefaultRedirectUri(): string {
    return this.config.redirectUri;
  }
}
