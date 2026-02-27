import { useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../../infrastructure/api/apiClient";
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../../infrastructure/auth/oauthPkce";
import { tokenStorage } from "../../infrastructure/auth/tokenStorage";
import {
  AuthContext,
  type AuthUser,
  type OAuthProviderInfo,
} from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oauthProviders, setOAuthProviders] = useState<OAuthProviderInfo[]>([]);

  const checkToken = async (): Promise<boolean> => {
    if (!tokenStorage.hasTokens()) {
      return false;
    }

    try {
      const response = await apiClient.get<{
        valid: boolean;
        user?: AuthUser;
      }>("/auth/validate", { skipAuth: false });

      if (response.valid && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>("/auth/login", { email, password }, { skipAuth: true });

    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>(
      "/auth/register",
      { name, email, password },
      { skipAuth: true }
    );

    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const loadOAuthProviders = async (): Promise<void> => {
    try {
      const providers = await apiClient.get<OAuthProviderInfo[]>(
        "/auth/providers",
        {
          skipAuth: true,
        }
      );
      setOAuthProviders(providers);
    } catch {
      setOAuthProviders([]);
    }
  };

  const startOAuthLogin = async (provider: string): Promise<void> => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem(`oauth:pkce:${provider}`, codeVerifier);

    const response = await apiClient.post<{
      authorizationUrl: string;
      state: string;
    }>(
      `/auth/oauth/${provider}/start`,
      {
        codeChallenge,
        redirectUri: `${window.location.origin}`,
      },
      { skipAuth: true }
    );

    window.location.assign(response.authorizationUrl);
  };

  const completeOAuthCallback = async (params: {
    provider: string;
    code: string;
    state: string;
  }): Promise<void> => {
    const codeVerifier = sessionStorage.getItem(
      `oauth:pkce:${params.provider}`
    );

    if (!codeVerifier) {
      throw new Error("PKCE code verifier not found for OAuth callback.");
    }

    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>(
      `/auth/oauth/${params.provider}/callback`,
      {
        state: params.state,
        code: params.code,
        codeVerifier,
      },
      { skipAuth: true }
    );

    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    sessionStorage.removeItem(`oauth:pkce:${params.provider}`);
  };

  const logout = (): void => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await loadOAuthProviders();
      await checkToken();
      setIsLoading(false);
    };

    void initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        oauthProviders,
        login,
        register,
        startOAuthLogin,
        completeOAuthCallback,
        logout,
        checkToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
