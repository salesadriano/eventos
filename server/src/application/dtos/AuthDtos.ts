export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    profile: string;
  };
}

export interface OAuthProviderResponse {
  provider: string;
  displayName: string;
}

export interface StartOAuthRequest {
  codeChallenge: string;
  redirectUri?: string;
}

export interface StartOAuthResponse {
  provider: string;
  state: string;
  authorizationUrl: string;
  expiresAt: string;
}

export interface OAuthCallbackRequest {
  state: string;
  code: string;
  codeVerifier: string;
  redirectUri?: string;
}

export interface OAuthCallbackResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile: string;
  };
}
