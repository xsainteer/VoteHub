import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService, LoginRequest, RegisterRequest, InfoResponse } from '../services/api';

interface AuthContextType {
  user: InfoResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<InfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserInfo = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const userInfo = await apiService.getUserInfo();
        setUser(userInfo);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      apiService.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUserInfo();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await apiService.login(credentials);
      await refreshUserInfo();
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      await apiService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};