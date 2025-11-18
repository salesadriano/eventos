import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/api/apiClient";
import { tokenStorage } from "../../infrastructure/auth/tokenStorage";

interface User {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async (): Promise<boolean> => {
    if (!tokenStorage.hasTokens()) {
      return false;
    }

    try {
      const response = await apiClient.get<{
        valid: boolean;
        user?: User;
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
      user: User;
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

    initAuth();
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

