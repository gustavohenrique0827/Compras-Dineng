
import { toast } from 'sonner';

// Interfaces para os tipos de usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  nivel_acesso: 'admin' | 'gerente' | 'supervisor' | 'comprador' | 'solicitante';
  ativo: boolean;
  departamento?: string;
}

export interface NivelAutorizacao {
  id: number;
  nome: string;
  cor: string;
  descricao?: string;
  compras_impeditivas: number;
  compras_consumo: number;
  compras_estoque: number;
  compras_locais: number;
  compras_investimentos: number;
  alojamentos: number;
}

export interface CentroCusto {
  id: number;
  codigo: string;
  descricao: string;
  ativo: boolean;
}

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Obter dados do usuário atual
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    return null;
  }
};

// Verificar se o usuário tem determinado nível de acesso
export const hasAccess = (requiredLevels: Array<User['nivel_acesso']>): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return requiredLevels.includes(user.nivel_acesso);
};

// Fazer logout
export const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  
  // Redirecionar para login (deve ser chamado do componente com acesso ao navigate)
  window.location.href = '/login';
  
  toast.success('Logout realizado com sucesso!');
};

// Níveis de acesso e suas descrições
export const accessLevels = [
  { value: 'admin', label: 'Administrador', description: 'Acesso total ao sistema' },
  { value: 'gerente', label: 'Gerente', description: 'Aprovação final e gestão de usuários' },
  { value: 'supervisor', label: 'Supervisor', description: 'Aprovação intermediária e cotações' },
  { value: 'comprador', label: 'Comprador', description: 'Criar cotações e negociar com fornecedores' },
  { value: 'solicitante', label: 'Solicitante', description: 'Criar solicitações de compra' }
];

// Cores dos níveis de autorização
export const authorizationColors = {
  'Amarelo': 'bg-yellow-500',
  'Azul': 'bg-blue-500',
  'Marrom': 'bg-amber-800',
  'Verde': 'bg-green-500'
};
