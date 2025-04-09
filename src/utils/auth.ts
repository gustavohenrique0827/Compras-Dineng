
import { toast } from 'sonner';

// Interfaces para os tipos de usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  nivel_acesso: string;
  nivel?: 'amarelo' | 'azul' | 'marrom' | 'verde';
  ativo: boolean;
  departamento?: string;
  matricula?: string;
  permissoes?: {
    compra_impeditivos: number;
    compra_consumo: number;
    compra_estoque: number;
    compra_locais: number;
    compra_investimentos: number;
    compra_alojamentos: number;
    compra_supermercados: number;
    aprova_solicitacao: number;
  };
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

// Verificar se o usuário tem o cargo necessário para ter acesso
export const hasAccess = (requiredCargos: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return requiredCargos.includes(user.cargo);
};

// Fazer logout
export const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  
  // Redirecionar para login (deve ser chamado do componente com acesso ao navigate)
  window.location.href = '/login';
  
  toast.success('Logout realizado com sucesso!');
};

// Opções de cargo disponíveis
export const availablePositions = [
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Gerente', label: 'Gerente' },
  { value: 'Diretor', label: 'Diretor' },
  { value: 'Diretoria', label: 'Diretoria' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Segurança', label: 'Segurança' },
  { value: 'Coordenador', label: 'Coordenador' },
  { value: 'Coordenação', label: 'Coordenação' },
  { value: 'Comprador', label: 'Comprador' },
  { value: 'Levantador', label: 'Levantador' },
  { value: 'Encarregado', label: 'Encarregado' },
];

// Opções de nível de acesso
export const accessLevelOptions = [
  { value: 'verde', label: 'Verde', description: 'Gerência / Diretoria', color: 'bg-green-500' },
  { value: 'azul', label: 'Azul', description: 'Supervisão / Segurança', color: 'bg-blue-500' },
  { value: 'marrom', label: 'Marrom', description: 'Coordenação', color: 'bg-amber-800' },
  { value: 'amarelo', label: 'Amarelo', description: 'Levantador / Encarregado', color: 'bg-yellow-500' },
];

// Cargos e seus níveis de acesso correspondentes (mantido para compatibilidade)
export const accessLevels = [
  { value: 'Administrador', label: 'Administrador', description: 'Nível Verde - Acesso total ao sistema', color: 'bg-green-500', nivel: 'verde' },
  { value: 'Gerente', label: 'Gerente', description: 'Nível Verde - Acesso total ao sistema', color: 'bg-green-500', nivel: 'verde' },
  { value: 'Diretor', label: 'Diretor', description: 'Nível Verde - Acesso total ao sistema', color: 'bg-green-500', nivel: 'verde' },
  { value: 'Diretoria', label: 'Diretoria', description: 'Nível Verde - Acesso total ao sistema', color: 'bg-green-500', nivel: 'verde' },
  { value: 'Supervisor', label: 'Supervisor', description: 'Nível Azul - Aprovações de alto nível', color: 'bg-blue-500', nivel: 'azul' },
  { value: 'Segurança', label: 'Segurança', description: 'Nível Azul - Aprovações de alto nível', color: 'bg-blue-500', nivel: 'azul' },
  { value: 'Coordenador', label: 'Coordenador', description: 'Nível Marrom - Aprovações intermediárias', color: 'bg-amber-800', nivel: 'marrom' },
  { value: 'Coordenação', label: 'Coordenação', description: 'Nível Marrom - Aprovações intermediárias', color: 'bg-amber-800', nivel: 'marrom' },
  { value: 'Comprador', label: 'Comprador', description: 'Nível Amarelo - Acesso básico', color: 'bg-yellow-500', nivel: 'amarelo' },
  { value: 'Levantador', label: 'Levantador', description: 'Nível Amarelo - Acesso básico', color: 'bg-yellow-500', nivel: 'amarelo' },
  { value: 'Encarregado', label: 'Encarregado', description: 'Nível Amarelo - Acesso básico', color: 'bg-yellow-500', nivel: 'amarelo' },
];

// Obter nível de acesso com base no cargo
export const getNivelAcessoByCargo = (cargo: string): string => {
  const cargoInfo = accessLevels.find(level => 
    level.value.toLowerCase() === cargo.toLowerCase()
  );
  return cargoInfo ? cargoInfo.nivel : 'amarelo'; // Default para o nível mais baixo
};

// Obter cor para um nível de acesso
export const getNivelAcessoColorClass = (nivel: string | undefined): string => {
  if (!nivel) return 'bg-gray-300';
  
  const nivelLower = nivel.toLowerCase();
  
  if (nivelLower.includes('verde') || nivelLower === 'verde') return 'bg-green-500';
  if (nivelLower.includes('azul') || nivelLower === 'azul') return 'bg-blue-500';
  if (nivelLower.includes('marrom') || nivelLower === 'marrom') return 'bg-amber-800';
  if (nivelLower.includes('amarelo') || nivelLower === 'amarelo') return 'bg-yellow-500';
  
  return 'bg-gray-300';
};

// Obter label para um nível de acesso
export const getNivelAcessoLabel = (nivel: string | undefined): string => {
  if (!nivel) return 'Não definido';
  
  const nivelLower = nivel.toLowerCase();
  
  if (nivelLower.includes('verde') || nivelLower === 'verde') return 'Gerência / Diretoria';
  if (nivelLower.includes('azul') || nivelLower === 'azul') return 'Supervisão / Segurança';
  if (nivelLower.includes('marrom') || nivelLower === 'marrom') return 'Coordenação';
  if (nivelLower.includes('amarelo') || nivelLower === 'amarelo') return 'Levantador / Encarregado';
  
  return nivel;
};

// Cores dos níveis de autorização
export const authorizationColors = {
  'Amarelo': 'bg-yellow-500',
  'Azul': 'bg-blue-500',
  'Marrom': 'bg-amber-800',
  'Verde': 'bg-green-500'
};

// Função auxiliar para verificar se uma resposta é JSON válido
export const isValidJSON = async (response: Response): Promise<boolean> => {
  try {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return false;
    }
    
    await response.json();
    return true;
  } catch (error) {
    return false;
  }
};
