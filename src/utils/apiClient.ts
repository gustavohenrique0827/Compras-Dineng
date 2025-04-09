
import { toast } from 'sonner';

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Interface para opções de requisição
interface ApiOptions extends RequestInit {
  noToast?: boolean;
}

// Função para criar a URL da API
const getApiUrl = (endpoint: string) => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  return `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

// Cliente de API
export const apiClient = {
  async get(endpoint: string, options: ApiOptions = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },
  
  async post(endpoint: string, data: any, options: ApiOptions = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  async put(endpoint: string, data: any, options: ApiOptions = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  async patch(endpoint: string, data: any, options: ApiOptions = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  async delete(endpoint: string, options: ApiOptions = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },
  
  async request(endpoint: string, options: ApiOptions = {}) {
    try {
      console.log(`Fazendo requisição para: ${endpoint}`, options);
      
      // Extrair opções personalizadas
      const { noToast, ...fetchOptions } = options;
      
      // Fazer a requisição
      const response = await fetch(getApiUrl(endpoint), fetchOptions);
      
      // Verificar resposta como texto primeiro
      const responseText = await response.text();
      console.log(`Resposta recebida de ${endpoint}:`, responseText);
      
      // Tentar analisar como JSON se possível
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (err) {
        console.error(`Erro ao analisar resposta como JSON: ${responseText}`);
        throw new Error(`Resposta não pode ser processada: ${responseText.substring(0, 100)}...`);
      }
      
      // Se a resposta não for bem-sucedida, lançar um erro
      if (!response.ok) {
        const errorMessage = data?.message || 'Ocorreu um erro desconhecido';
        if (!noToast) {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
      
      // Caso contrário, retornar os dados
      if (data?.success && data?.message && !noToast) {
        toast.success(data.message);
      }
      
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      if (!options.noToast) {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }
};

// Funções de serviço para usuários
export const userService = {
  // Obter todos os usuários
  async getAllUsers() {
    try {
      console.log('Fetching users from: /users');
      return await apiClient.get('/users');
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  },
  
  // Criar um novo usuário
  async createUser(userData: any) {
    console.log('Submitting user to: /users');
    console.log('User data:', userData);
    return await apiClient.post('/users', userData);
  },
  
  // Atualizar um usuário existente
  async updateUser(id: number, userData: any) {
    return await apiClient.put(`/users/${id}`, userData);
  },
  
  // Alterar o status de um usuário (ativar/desativar)
  async toggleUserStatus(id: number, active: boolean) {
    return await apiClient.patch(`/users/${id}/status`, { ativo: active });
  },
  
  // Alterar a senha de um usuário
  async changePassword(id: number, currentPassword: string, newPassword: string) {
    return await apiClient.patch(`/users/${id}/senha`, {
      senhaAtual: currentPassword,
      novaSenha: newPassword
    });
  }
};
