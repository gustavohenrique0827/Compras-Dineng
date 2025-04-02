
// Type definitions for database entities
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

// Mock data for frontend use
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

// Simulated API connection
export const testConnection = async (): Promise<boolean> => {
  console.log('Simulando conexão com o banco de dados');
  // We're letting the app know we're in mock mode
  return false;
};

// Get all requests
export const getAllRequests = async (): Promise<Request[]> => {
  console.log('Utilizando dados simulados para solicitações');
  return [...mockRequests];
};

// Get request by ID with items
export const getRequestById = async (id: number): Promise<any> => {
  console.log(`Buscando solicitação ${id} (dados simulados)`);
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
};

// Create new request
export const createRequest = async (requestData: any, items: any[]): Promise<number> => {
  console.log('Criando nova solicitação (dados simulados)');
  // Simulate creating a new request with ID
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
  
  // Add items
  let itemId = mockItems.length + 1;
  items.forEach(item => {
    mockItems.push({
      id: itemId++,
      descricao: item.description,
      quantidade: item.quantity,
      solicitacao_id: newId,
      id_solicitante: 1 // Assuming user ID 1
    });
  });
  
  return newId;
};

// Update request status
export const updateRequestStatus = async (id: number, status: string, approvalData?: any): Promise<boolean> => {
  console.log(`Atualizando status da solicitação ${id} para ${status} (dados simulados)`);
  const requestIndex = mockRequests.findIndex(req => req.id === id);
  if (requestIndex === -1) {
    return false;
  }
  
  mockRequests[requestIndex].status = status;
  
  // Add approval record if provided
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
};

// Create quote
export const createQuote = async (quoteData: any): Promise<any> => {
  console.log('Criando cotação (dados simulados)', quoteData);
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
  
  // Update the request status to "Em Cotação" if it's currently "Aprovado"
  const requestIndex = mockRequests.findIndex(req => req.id === quoteData.requestId);
  if (requestIndex !== -1 && mockRequests[requestIndex].status === 'Aprovado') {
    mockRequests[requestIndex].status = 'Em Cotação';
  }
  
  return { insertId: newId };
};

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  console.log('Buscando fornecedores (dados simulados)');
  return [...mockSuppliers];
};

// Create supplier
export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<number> => {
  console.log('Criando fornecedor (dados simulados)', supplierData);
  const newId = mockSuppliers.length + 1;
  
  const newSupplier: Supplier = {
    id: newId,
    ...supplierData
  };
  
  mockSuppliers.push(newSupplier);
  
  return newId;
};

// Update quote status
export const updateQuoteStatus = async (id: number, status: string, approvedBy?: string, approvalLevel?: string): Promise<boolean> => {
  console.log(`Atualizando status da cotação ${id} para ${status} (dados simulados)`);
  const quoteIndex = mockQuotes.findIndex(quote => quote.id === id);
  if (quoteIndex === -1) {
    return false;
  }
  
  mockQuotes[quoteIndex].status = status;
  if (approvedBy) mockQuotes[quoteIndex].aprovado_por = approvedBy;
  if (approvalLevel) mockQuotes[quoteIndex].nivel_aprovacao = approvalLevel;
  
  return true;
};

// Update request details
export const updateRequestDetails = async (id: number, updateData: Partial<Request>): Promise<boolean> => {
  console.log(`Atualizando detalhes da solicitação ${id} (dados simulados)`, updateData);
  const requestIndex = mockRequests.findIndex(req => req.id === id);
  if (requestIndex === -1) {
    return false;
  }
  
  mockRequests[requestIndex] = {
    ...mockRequests[requestIndex],
    ...updateData
  };
  
  return true;
};

// Show a connection config message to the user
console.log('Database Config: Usando dados simulados no frontend.');
console.log('Para configurar uma conexão real com o banco de dados, use um backend apropriado como Node.js com Express.');
console.log('Configuração desejada:', {
  host: '192.168.0.249',
  user: 'dineng',
  password: 'dineng@@2025',
  database: 'sisdineng',
  port: 3306
});
