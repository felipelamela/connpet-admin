/**
 * Hook de Autenticação usando Cookies HttpOnly
 * 
 * Este hook fornece acesso ao estado de autenticação
 * sem precisar verificar localStorage (que não é mais usado)
 */

import { useRouter } from 'next/navigation';
import api from '@/services/api';

export function useAuth() {
  const router = useRouter();

  /**
   * Verificar se está autenticado via cookie HttpOnly
   * O cookie é enviado automaticamente pelo browser
   */
  async function checkAuth(): Promise<boolean> {
    try {
      await api.get('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fazer login
   */
  async function login(email: string, password: string) {
    try {
      const response = await api.login({ email, password });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fazer logout
   */
  async function logout() {
    try {
      await api.logout();
      router.push('/login');
    } catch (error) {
      // Mesmo com erro, redirecionar para login
      router.push('/login');
    }
  }

  return {
    checkAuth,
    login,
    logout,
  };
}

