export interface OAuthProviderProfile {
  subject: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

export interface OAuthAuthorizationParams {
  state: string;
  codeChallenge: string;
  redirectUri: string;
}

export interface OAuthCodeExchangeParams {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface OAuthProviderClient {
  readonly provider: string;
  readonly displayName: string;
  getDefaultRedirectUri(): string;
  getAuthorizationUrl(params: OAuthAuthorizationParams): string;
  exchangeCodeForProfile(params: OAuthCodeExchangeParams): Promise<OAuthProviderProfile>;
}
