import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, initializeDemoData, type User, type Role } from '../lib/mockApi';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await initializeDemoData();
      const currentUser = authApi.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data) {
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: Role = 'user') => {
    const response = await authApi.register({ name, email, password, role });
    if (response.success && response.data) {
      setUser(response.data.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
