import { ValidationError } from "../../../domain/errors/ApplicationError";
import type {
  OAuthAuthorizationParams,
  OAuthCodeExchangeParams,
  OAuthProviderClient,
  OAuthProviderProfile,
} from "./OAuthProviderClient";

interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfoResponse {
  sub?: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
}

export class GoogleOAuthProviderClient implements OAuthProviderClient {
  readonly provider = "google";
  readonly displayName = "Google";

  constructor(private readonly config: GoogleOAuthConfig) {}

  getAuthorizationUrl(params: OAuthAuthorizationParams): string {
    const search = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: params.redirectUri,
      scope: this.config.scopes.join(" "),
      state: params.state,
      code_challenge: params.codeChallenge,
      code_challenge_method: "S256",
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
    });

    return `${this.config.authorizationUrl}?${search.toString()}`;
  }

  async exchangeCodeForProfile(
    params: OAuthCodeExchangeParams
  ): Promise<OAuthProviderProfile> {
    const body = new URLSearchParams({
      code: params.code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code",
      code_verifier: params.codeVerifier,
    });

    const tokenResponse = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      throw new ValidationError(
        tokenPayload.error_description || tokenPayload.error || "OAuth token exchange failed"
      );
    }

    const userResponse = await fetch(this.config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
      },
    });

    const userPayload = (await userResponse.json()) as GoogleUserInfoResponse;

    if (!userResponse.ok || !userPayload.sub || !userPayload.email) {
      throw new ValidationError("OAuth user profile resolution failed");
    }

    return {
      subject: userPayload.sub,
      email: userPayload.email,
      name: userPayload.name,
      emailVerified: userPayload.email_verified,
    };
  }

  getDefaultRedirectUri(): string {
    return this.config.redirectUri;
  }
}
