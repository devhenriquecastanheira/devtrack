import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login as loginRequest } from '../api/auth';
import type { LoginRequest, User } from '../types/auth';

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function clearSession() {
    localStorage.removeItem('devtrack:accessToken');
    localStorage.removeItem('devtrack:refreshToken');
    setUser(null);
  }

  async function loadCurrentUser() {
    const accessToken = localStorage.getItem('devtrack:accessToken');

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function login(data: LoginRequest) {
    const tokens = await loginRequest(data);

    localStorage.setItem('devtrack:accessToken', tokens.access);
    localStorage.setItem('devtrack:refreshToken', tokens.refresh);

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  }

  function logout() {
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}