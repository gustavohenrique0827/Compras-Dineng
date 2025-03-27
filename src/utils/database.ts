
// This file now serves as a client-side API interface rather than direct database connection
// Browser-compatible version

// Define types for data structures
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
  data_limite?: string;
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
  motivo_rejeicao?: string;
  data_aprovacao: string;
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

// Mock data for development until backend is implemented
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

// Test connection simulation
export const testConnection = async (): Promise<boolean> => {
  // In a browser environment, we just simulate a successful connection
  console.log('Simulando conexão com o banco de dados');
  return true;
};

// Simulate database queries with mock data
export const query = async (sql: string, params: any[] = []): Promise<any[]> => {
  console.log('Query simulation:', sql, params);
  return [];
};

// Get all requests
export const getAllRequests = async (): Promise<Request[]> => {
  console.log('Fetching all requests');
  return [...mockRequests];
};

// Get request by ID with items
export const getRequestById = async (id: number): Promise<any> => {
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
  console.log('Creating new request:', requestData, items);
  
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
  console.log('Updating request status:', id, status, approvalData);
  
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
  console.log('Creating quote:', quoteData);
  
  const newId = mockQuotes.length + 1;
  
  const newQuote: Quote = {
    id: newId,
    solicitacao_id: quoteData.solicitacao_id,
    fornecedor: quoteData.fornecedor,
    preco: quoteData.preco,
    prazo_entrega: quoteData.prazo_entrega,
    condicoes: quoteData.condicoes,
    nivel_aprovacao: quoteData.nivel_aprovacao,
    status: 'Em Cotação'
  };
  
  mockQuotes.push(newQuote);
  
  return { insertId: newId };
};

// Update quote status
export const updateQuoteStatus = async (id: number, status: string, approvedBy?: string, approvalLevel?: string): Promise<boolean> => {
  console.log('Updating quote status:', id, status, approvedBy, approvalLevel);
  
  const quoteIndex = mockQuotes.findIndex(quote => quote.id === id);
  if (quoteIndex === -1) {
    return false;
  }
  
  mockQuotes[quoteIndex].status = status;
  if (approvedBy) mockQuotes[quoteIndex].aprovado_por = approvedBy;
  if (approvalLevel) mockQuotes[quoteIndex].nivel_aprovacao = approvalLevel;
  
  return true;
};

// Create supplier
export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<number> => {
  console.log('Creating supplier:', supplierData);
  
  const newId = mockSuppliers.length + 1;
  
  const newSupplier: Supplier = {
    id: newId,
    ...supplierData
  };
  
  mockSuppliers.push(newSupplier);
  
  return newId;
};

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  console.log('Fetching all suppliers');
  return [...mockSuppliers];
};

// Update request details
export const updateRequestDetails = async (id: number, updateData: Partial<Request>): Promise<boolean> => {
  console.log('Updating request details:', id, updateData);
  
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
