import { toast } from 'sonner';

// Definição dos tipos para entidades do banco de dados
export interface Request {
  id: number;
  nome_solicitante: string;
  aplicacao: string;
  centro_custo: string;
  data_solicitacao: string;
  local_entrega: string;
  prazo_entrega: string;
  categoria: string;
  motivo: string;
  prioridade: string;
  status: string;
}

export interface Item {
  id: number;
  descricao: string;
  quantidade: number;
  solicitacao_id: number;
  id_solicitante: number;
}

export interface Approval {
  id: number;
  solicitacao_id: number;
  etapa: string;
  status: string;
  aprovado_por: string;
  nivel_aprovacao: string;
  data_aprovacao: string;
  motivo_rejeicao?: string;
}

export interface Quote {
  id: number;
  solicitacao_id: number;
  fornecedor: string;
  preco: number;
  prazo_entrega: string;
  condicoes: string;
  nivel_aprovacao: string;
  status: string;
  aprovado_por?: string;
}

export interface Supplier {
  id: number;
  nome: string;
  categoria: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
}

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Dados simulados para fallback (caso a API não esteja disponível)
const mockRequests: Request[] = [
  {
    id: 1,
    nome_solicitante: 'João Silva',
    aplicacao: 'Manutenção Predial',
    centro_custo: 'CC-001',
    data_solicitacao: '2024-03-20',
    local_entrega: 'Almoxarifado Central',
    prazo_entrega: '2024-04-10',
    categoria: 'Materiais',
    motivo: 'Manutenção preventiva no sistema de ar condicionado',
    prioridade: 'Moderada',
    status: 'Solicitado'
  },
  {
    id: 2,
    nome_solicitante: 'Maria Santos',
    aplicacao: 'Laboratório Químico',
    centro_custo: 'CC-002',
    data_solicitacao: '2024-03-22',
    local_entrega: 'Laboratório Bloco B',
    prazo_entrega: '2024-03-30',
    categoria: 'Materiais',
    motivo: 'Reposição de reagentes para experimentos em andamento',
    prioridade: 'Urgente',
    status: 'Aprovado'
  },
  {
    id: 3,
    nome_solicitante: 'Carlos Ferreira',
    aplicacao: 'Escritório Administrativo',
    centro_custo: 'CC-003',
    data_solicitacao: '2024-03-15',
    local_entrega: 'Setor Administrativo',
    prazo_entrega: '2024-04-15',
    categoria: 'Materiais',
    motivo: 'Reposição de material de escritório',
    prioridade: 'Básica',
    status: 'Em Cotação'
  }
];

const mockItems: Item[] = [
  { id: 1, descricao: 'Filtro para ar condicionado 20x20', quantidade: 10, solicitacao_id: 1, id_solicitante: 1 },
  { id: 2, descricao: 'Gás refrigerante R410A', quantidade: 2, solicitacao_id: 1, id_solicitante: 1 },
  { id: 3, descricao: 'Ácido clorídrico PA 1L', quantidade: 5, solicitacao_id: 2, id_solicitante: 2 },
  { id: 4, descricao: 'Hidróxido de sódio PA 500g', quantidade: 3, solicitacao_id: 2, id_solicitante: 2 },
  { id: 5, descricao: 'Papel sulfite A4 (resma)', quantidade: 20, solicitacao_id: 3, id_solicitante: 3 },
  { id: 6, descricao: 'Canetas esferográficas azuis', quantidade: 50, solicitacao_id: 3, id_solicitante: 3 }
];

const mockApprovals: Approval[] = [
  { 
    id: 1, 
    solicitacao_id: 2, 
    etapa: 'Primeira aprovação', 
    status: 'Aprovado', 
    aprovado_por: 'Pedro Oliveira',
    nivel_aprovacao: 'Coordenador',
    data_aprovacao: '2024-03-23'
  }
];

const mockQuotes: Quote[] = [
  {
    id: 1,
    solicitacao_id: 3,
    fornecedor: 'Papelaria Central',
    preco: 1250.00,
    prazo_entrega: '3 dias úteis',
    condicoes: 'Pagamento em 30 dias',
    nivel_aprovacao: 'Gerência',
    status: 'Em Cotação'
  }
];

const mockSuppliers: Supplier[] = [
  { id: 1, nome: 'Fornecedor A Ltda', categoria: 'Equipamentos', contato: 'João Silva', telefone: '(11) 98765-4321', email: 'contato@fornecedora.com', endereco: 'Rua A, 123 - São Paulo/SP' },
  { id: 2, nome: 'Fornecedor B S.A.', categoria: 'Materiais', contato: 'Maria Oliveira', telefone: '(11) 91234-5678', email: 'vendas@fornecedorb.com', endereco: 'Av. B, 456 - Rio de Janeiro/RJ' },
  { id: 3, nome: 'Fornecedor C ME', categoria: 'Serviços', contato: 'Carlos Santos', telefone: '(11) 99876-5432', email: 'carlos@fornecedorc.com', endereco: 'Praça C, 789 - Belo Horizonte/MG' },
  { id: 4, nome: 'Fornecedor D EPP', categoria: 'Manutenção', contato: 'Ana Souza', telefone: '(11) 92345-6789', email: 'contato@fornecedord.com', endereco: 'Alameda D, 1011 - Brasília/DF' },
];

// Testar conexão com a API
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/test-connection`);
    if (!response.ok) {
      throw new Error('Falha na conexão com a API');
    }
    const data = await response.json();
    console.log('Conexão com a API estabelecida', data);
    return true;
  } catch (error) {
    console.error('Erro ao conectar com a API:', error);
    console.log('Utilizando dados simulados como fallback');
    return false;
  }
};

// Função auxiliar para fazer requisições à API com fallback para dados simulados
const apiRequest = async (endpoint: string, options?: RequestInit, fallbackFn?: Function) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição à API (${endpoint}):`, error);
    if (fallbackFn) {
      console.log('Usando dados simulados como fallback');
      return fallbackFn();
    }
    throw error;
  }
};

// Obter todas as solicitações
export const getAllRequests = async (): Promise<Request[]> => {
  return apiRequest('/requests', undefined, () => [...mockRequests]);
};

// Obter solicitação por ID
export const getRequestById = async (id: number): Promise<any> => {
  return apiRequest(`/requests/${id}`, undefined, () => {
    const request = mockRequests.find(req => req.id === id);
    if (!request) {
      return null;
    }
    
    const items = mockItems.filter(item => item.solicitacao_id === id);
    const approvals = mockApprovals.filter(approval => approval.solicitacao_id === id);
    const quotes = mockQuotes.filter(quote => quote.solicitacao_id === id);
    
    return {
      ...request,
      items,
      approvals,
      quotes
    };
  });
};

// Criar nova solicitação
export const createRequest = async (requestData: any, items: any[]): Promise<number> => {
  return apiRequest('/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestData, items })
  }, () => {
    // Simulação de criação usando dados simulados
    const newId = mockRequests.length + 1;
    
    const newRequest: Request = {
      id: newId,
      nome_solicitante: requestData.requesterName,
      aplicacao: requestData.application,
      centro_custo: requestData.costCenter,
      data_solicitacao: new Date().toISOString().split('T')[0],
      local_entrega: requestData.deliveryLocation,
      prazo_entrega: requestData.deliveryDeadline,
      categoria: requestData.category,
      motivo: requestData.reason,
      prioridade: requestData.priority,
      status: 'Solicitado'
    };
    
    mockRequests.push(newRequest);
    
    let itemId = mockItems.length + 1;
    items.forEach(item => {
      mockItems.push({
        id: itemId++,
        descricao: item.description,
        quantidade: item.quantity,
        solicitacao_id: newId,
        id_solicitante: 1
      });
    });
    
    return newId;
  }).then(data => data.id || data);
};

// Atualizar status da solicitação
export const updateRequestStatus = async (id: number, status: string, approvalData?: any): Promise<boolean> => {
  return apiRequest(`/requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, approvalData })
  }, () => {
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return false;
    }
    
    mockRequests[requestIndex].status = status;
    
    if (approvalData) {
      const newApprovalId = mockApprovals.length + 1;
      mockApprovals.push({
        id: newApprovalId,
        solicitacao_id: id,
        etapa: approvalData.etapa,
        status: approvalData.status,
        aprovado_por: approvalData.aprovado_por,
        nivel_aprovacao: approvalData.nivel_aprovacao,
        motivo_rejeicao: approvalData.motivo_rejeicao,
        data_aprovacao: new Date().toISOString().split('T')[0]
      });
    }
    
    return true;
  }).then(data => data.success || data);
};

// Criar cotação
export const createQuote = async (quoteData: any): Promise<any> => {
  return apiRequest('/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData)
  }, () => {
    const newId = mockQuotes.length + 1;
    
    const newQuote: Quote = {
      id: newId,
      solicitacao_id: quoteData.requestId,
      fornecedor: quoteData.fornecedor || 'Fornecedor não especificado',
      preco: quoteData.totalValue || 0,
      prazo_entrega: quoteData.prazo_entrega || '5 dias úteis',
      condicoes: quoteData.condicoes || 'Condições padrão',
      nivel_aprovacao: quoteData.approvalLevel || 'Gerência',
      status: quoteData.status || 'Em Cotação'
    };
    
    mockQuotes.push(newQuote);
    
    const requestIndex = mockRequests.findIndex(req => req.id === quoteData.requestId);
    if (requestIndex !== -1 && mockRequests[requestIndex].status === 'Aprovado') {
      mockRequests[requestIndex].status = 'Em Cotação';
    }
    
    return { insertId: newId };
  });
};

// Obter todos os fornecedores
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return apiRequest('/suppliers', undefined, () => [...mockSuppliers]);
};

// Criar fornecedor
export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<number> => {
  return apiRequest('/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData)
  }, () => {
    const newId = mockSuppliers.length + 1;
    
    const newSupplier: Supplier = {
      id: newId,
      ...supplierData
    };
    
    mockSuppliers.push(newSupplier);
    
    return newId;
  }).then(data => data.id || data);
};

// Atualizar status da cotação
export const updateQuoteStatus = async (id: number, status: string, approvedBy?: string, approvalLevel?: string): Promise<boolean> => {
  return apiRequest(`/quotes/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, approvedBy, approvalLevel })
  }, () => {
    const quoteIndex = mockQuotes.findIndex(quote => quote.id === id);
    if (quoteIndex === -1) {
      return false;
    }
    
    mockQuotes[quoteIndex].status = status;
    if (approvedBy) mockQuotes[quoteIndex].aprovado_por = approvedBy;
    if (approvalLevel) mockQuotes[quoteIndex].nivel_aprovacao = approvalLevel;
    
    return true;
  }).then(data => data.success || data);
};

// Atualizar detalhes da solicitação
export const updateRequestDetails = async (id: number, updateData: Partial<Request>): Promise<boolean> => {
  return apiRequest(`/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  }, () => {
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return false;
    }
    
    mockRequests[requestIndex] = {
      ...mockRequests[requestIndex],
      ...updateData
    };
    
    return true;
  }).then(data => data.success || data);
};

// Exibir mensagem de configuração
console.log('Database Config: Tentando conectar à API em ' + API_URL);
console.log('Se a API não estiver disponível, o sistema usará dados simulados locais.');
console.log('Para configurar o ambiente de produção, execute o servidor Node.js na pasta server/');
