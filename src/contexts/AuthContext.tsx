'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { toast } from 'sonner';

interface PanelSummary {
  id: string;
  type: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  companyId?: string | null;
  panelId?: string | null;
  panelType?: string | null;
  veterinaryClinicId?: string | null;
  panels?: PanelSummary[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  selectPanel: (panelId: string, panelType: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await api.get<User>('/auth/me');
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get('/auth/verify');
      } catch (error: any) {
        if (tokenCheckIntervalRef.current) {
          clearInterval(tokenCheckIntervalRef.current);
          tokenCheckIntervalRef.current = null;
        }

        setUser(null);
        setIsAuthenticated(false);
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        router.push('/login');
      }
    };

    tokenCheckIntervalRef.current = setInterval(validateToken, 10 * 60 * 1000);

    return () => {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
        tokenCheckIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, router]);

  /**
   * Fazer login
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });

      setUser(response.user);
      setIsAuthenticated(true);

      toast.success('Login realizado com sucesso!');

      router.push('/select-module');

    } catch (error: any) {
      const errorMessage = error?.message || 'Email ou senha incorretos';
      toast.error(errorMessage);
      throw error;
    }
  }, [router]);

  /**
   * Fazer logout
   */
  const logout = useCallback(async () => {

    try {
      await api.logout();
    } catch (error) {
    } finally {
      // Limpar intervalo de validação do token
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
        tokenCheckIntervalRef.current = null;
      }

      setUser(null);
      setIsAuthenticated(false);

      toast.success('Logout realizado com sucesso!');

      router.push('/login');
    }
  }, [router]);

  /**
   * Revalidar autenticação
   */
  const refreshAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      const userData = await api.get<User>('/auth/me');

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Selecionar painel ativo
   */
  const selectPanel = useCallback(async (panelId: string, panelType: string) => {
    try {
      const response = await api.post('/auth/select-panel', {
        panelId,
        panelType,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Módulo selecionado com sucesso!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Não foi possível selecionar o módulo.';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth,
        selectPanel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
