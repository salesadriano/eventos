import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profile: string;
}

export interface OAuthProviderInfo {
  provider: string;
  displayName: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  oauthProviders: OAuthProviderInfo[];
  login: (email: string, password: string) => Promise<void>;
  startOAuthLogin: (provider: string) => Promise<void>;
  completeOAuthCallback: (params: {
    provider: string;
    code: string;
    state: string;
  }) => Promise<void>;
  logout: () => void;
  checkToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
