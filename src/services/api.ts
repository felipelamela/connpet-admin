import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

/**
 * Configuração da API usando Axios com suporte a cookies HttpOnly
 */
class ApiServer {
  private api: AxiosInstance;

  constructor() {
    // Criar instância do axios com configuração base
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 🔥 IMPORTANTE: Envia cookies HttpOnly
    });

    // Configurar interceptor de resposta para tratamento de erros
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const url = error.config?.url || '';
        const status = error.response?.status;
        
        // Não logar erros 401 esperados em endpoints de autenticação
        // (são tratados silenciosamente pelo AuthContext)
        const isAuthEndpoint = url.includes('/auth/me') || url.includes('/auth/verify');
        const isExpected401 = status === 401 && isAuthEndpoint;
        
        if (!isExpected401) {
          console.error(`❌ [API] ${error.config?.method?.toUpperCase()} ${url} → ${status || 'Network Error'}`, {
            status: error.response?.status,
            data: error.response?.data,
          });
        }
        
        // Apenas propagar o erro, deixar o AuthContext gerenciar redirecionamentos
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Dados do usuário (token será armazenado em cookie HttpOnly)
   */
  async login(data:{email: string, password: string}) {
    try {
      const response = await this.api.post('/auth/login', { email: data.email, password: data.password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout do usuário
   * @returns Mensagem de sucesso
   */
  async logout() {
    try {
      const response = await this.api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Requisição GET
   * @param url - URL do endpoint
   * @param params - Query parameters (opcional)
   * @returns Dados da resposta
   */
  async get<T = any>(url: string, params?: Record<string, any>) {
    try {
      const response = await this.api.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Requisição POST
   * @param url - URL do endpoint
   * @param data - Dados do body
   * @returns Dados da resposta
   */
  async post<T = any>(url: string, data?: any) {
    try {
      const response = await this.api.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Requisição PUT
   * @param url - URL do endpoint
   * @param data - Dados do body
   * @returns Dados da resposta
   */
  async put<T = any>(url: string, data?: any) {
    try {
      const response = await this.api.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Requisição PATCH
   * @param url - URL do endpoint
   * @param data - Dados do body
   * @returns Dados da resposta
   */
  async patch<T = any>(url: string, data?: any) {
    try {
      const response = await this.api.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Requisição DELETE
   * @param url - URL do endpoint
   * @returns Dados da resposta
   */
  async delete<T = any>(url: string) {
    try {
      const response = await this.api.delete<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload de arquivo
   * @param url - URL do endpoint
   * @param file - Arquivo a ser enviado
   * @param fieldName - Nome do campo do arquivo (padrão: 'file')
   * @returns Dados da resposta
   */
  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file') {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await this.api.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento centralizado de erros
   * @param error - Erro do axios
   * @returns Erro formatado
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      
      // Erro de resposta do servidor
      if (axiosError.response) {
        const message = axiosError.response.data?.message || 'Erro no servidor';
        return new Error(message);
      }
      
      // Erro de requisição (network, timeout, etc)
      if (axiosError.request) {
        return new Error('Erro de conexão com o servidor');
      }
    }

    // Erro desconhecido
    return new Error('Erro inesperado');
  }

  /**
   * Obter instância do axios (para uso avançado)
   */
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Exportar instância única (singleton)
const api = new ApiServer();
export default api;