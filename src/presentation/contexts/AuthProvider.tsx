import { useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../../infrastructure/api/apiClient";
import { tokenStorage } from "../../infrastructure/auth/tokenStorage";
import { AuthContext, type AuthUser } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const logout = (): void => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
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
        login,
        logout,
        checkToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
