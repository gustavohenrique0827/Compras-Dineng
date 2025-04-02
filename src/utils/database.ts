import mysql from 'mysql2/promise';

// Type definitions remain the same
// ... keep existing code (Request, Item, Approval, Quote, Supplier interfaces)

// Create MySQL connection pool
const pool = mysql.createPool({
  host: '192.168.0.249',
  user: 'dineng',
  password: 'dineng@@2025',
  database: 'sisdineng',
  port: 3306
});

// Function to get a database connection
export const getConnection = async () => {
  return await pool.getConnection();
};

// Mock data for fallback
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

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

// Helper function to handle database queries with fallback to mock data
const executeQuery = async (queryFn: Function, mockFn: Function, ...params: any[]) => {
  try {
    // Try to execute the real database query
    const result = await queryFn(...params);
    return result;
  } catch (error) {
    console.error('Erro na consulta ao banco de dados:', error);
    console.log('Utilizando dados simulados como fallback');
    // Fall back to mock data if database query fails
    return mockFn(...params);
  }
};

// Get all requests
export const getAllRequests = async (): Promise<Request[]> => {
  const dbQuery = async () => {
    const connection = await getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM solicitacoes');
      return rows as Request[];
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = () => [...mockRequests];
  
  return executeQuery(dbQuery, mockQuery);
};

// Get request by ID with items
export const getRequestById = async (id: number): Promise<any> => {
  const dbQuery = async (id: number) => {
    const connection = await getConnection();
    try {
      // Get request details
      const [requests] = await connection.query('SELECT * FROM solicitacoes WHERE id = ?', [id]);
      const request = (requests as any[])[0];
      
      if (!request) {
        return null;
      }
      
      // Get items for this request
      const [items] = await connection.query('SELECT * FROM itens WHERE solicitacao_id = ?', [id]);
      
      // Get approvals for this request
      const [approvals] = await connection.query('SELECT * FROM aprovacoes WHERE solicitacao_id = ?', [id]);
      
      // Get quotes for this request
      const [quotes] = await connection.query('SELECT * FROM cotacoes WHERE solicitacao_id = ?', [id]);
      
      return {
        ...request,
        items,
        approvals,
        quotes
      };
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (id: number) => {
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
  
  return executeQuery(dbQuery, mockQuery, id);
};

// Create new request
export const createRequest = async (requestData: any, items: any[]): Promise<number> => {
  const dbQuery = async (requestData: any, items: any[]) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert request
      const [result] = await connection.query(
        `INSERT INTO solicitacoes (
          nome_solicitante, aplicacao, centro_custo, data_solicitacao, 
          local_entrega, prazo_entrega, categoria, motivo, prioridade, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          requestData.requesterName,
          requestData.application,
          requestData.costCenter,
          new Date().toISOString().split('T')[0],
          requestData.deliveryLocation,
          requestData.deliveryDeadline,
          requestData.category,
          requestData.reason,
          requestData.priority,
          'Solicitado'
        ]
      );
      
      const requestId = (result as any).insertId;
      
      // Insert items
      for (const item of items) {
        await connection.query(
          'INSERT INTO itens (descricao, quantidade, solicitacao_id, id_solicitante) VALUES (?, ?, ?, ?)',
          [item.description, item.quantity, requestId, 1] // Assuming user ID 1
        );
      }
      
      await connection.commit();
      return requestId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (requestData: any, items: any[]) => {
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
  
  return executeQuery(dbQuery, mockQuery, requestData, items);
};

// Update request status
export const updateRequestStatus = async (id: number, status: string, approvalData?: any): Promise<boolean> => {
  const dbQuery = async (id: number, status: string, approvalData?: any) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      // Update request status
      await connection.query(
        'UPDATE solicitacoes SET status = ? WHERE id = ?',
        [status, id]
      );
      
      // Add approval record if provided
      if (approvalData) {
        await connection.query(
          `INSERT INTO aprovacoes (
            solicitacao_id, etapa, status, aprovado_por, 
            nivel_aprovacao, motivo_rejeicao, data_aprovacao
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            approvalData.etapa,
            approvalData.status,
            approvalData.aprovado_por,
            approvalData.nivel_aprovacao,
            approvalData.motivo_rejeicao || null,
            new Date().toISOString().split('T')[0]
          ]
        );
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (id: number, status: string, approvalData?: any) => {
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
  
  return executeQuery(dbQuery, mockQuery, id, status, approvalData);
};

// Create quote
export const createQuote = async (quoteData: any): Promise<any> => {
  const dbQuery = async (quoteData: any) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert quote
      const [result] = await connection.query(
        `INSERT INTO cotacoes (
          solicitacao_id, fornecedor, preco, prazo_entrega, 
          condicoes, nivel_aprovacao, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          quoteData.solicitacao_id,
          quoteData.fornecedor,
          quoteData.preco,
          quoteData.prazo_entrega,
          quoteData.condicoes,
          quoteData.nivel_aprovacao,
          'Em Cotação'
        ]
      );
      
      await connection.commit();
      return { insertId: (result as any).insertId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (quoteData: any) => {
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
  
  return executeQuery(dbQuery, mockQuery, quoteData);
};

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const dbQuery = async () => {
    const connection = await getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM fornecedores');
      return rows as Supplier[];
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = () => [...mockSuppliers];
  
  return executeQuery(dbQuery, mockQuery);
};

// Create supplier
export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<number> => {
  const dbQuery = async (supplierData: Omit<Supplier, 'id'>) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert supplier
      const [result] = await connection.query(
        `INSERT INTO fornecedores (
          nome, categoria, contato, telefone, email, endereco
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          supplierData.nome,
          supplierData.categoria,
          supplierData.contato,
          supplierData.telefone,
          supplierData.email,
          supplierData.endereco
        ]
      );
      
      await connection.commit();
      return (result as any).insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (supplierData: Omit<Supplier, 'id'>) => {
    const newId = mockSuppliers.length + 1;
    
    const newSupplier: Supplier = {
      id: newId,
      ...supplierData
    };
    
    mockSuppliers.push(newSupplier);
    
    return newId;
  };
  
  return executeQuery(dbQuery, mockQuery, supplierData);
};

// Update quote status
export const updateQuoteStatus = async (id: number, status: string, approvedBy?: string, approvalLevel?: string): Promise<boolean> => {
  const dbQuery = async (id: number, status: string, approvedBy?: string, approvalLevel?: string) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      let query = 'UPDATE cotacoes SET status = ?';
      const params: any[] = [status];
      
      if (approvedBy) {
        query += ', aprovado_por = ?';
        params.push(approvedBy);
      }
      
      if (approvalLevel) {
        query += ', nivel_aprovacao = ?';
        params.push(approvalLevel);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      await connection.query(query, params);
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (id: number, status: string, approvedBy?: string, approvalLevel?: string) => {
    const quoteIndex = mockQuotes.findIndex(quote => quote.id === id);
    if (quoteIndex === -1) {
      return false;
    }
    
    mockQuotes[quoteIndex].status = status;
    if (approvedBy) mockQuotes[quoteIndex].aprovado_por = approvedBy;
    if (approvalLevel) mockQuotes[quoteIndex].nivel_aprovacao = approvalLevel;
    
    return true;
  };
  
  return executeQuery(dbQuery, mockQuery, id, status, approvedBy, approvalLevel);
};

// Update request details
export const updateRequestDetails = async (id: number, updateData: Partial<Request>): Promise<boolean> => {
  const dbQuery = async (id: number, updateData: Partial<Request>) => {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      
      const keys = Object.keys(updateData);
      if (keys.length === 0) {
        return false;
      }
      
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const values = keys.map(key => (updateData as any)[key]);
      values.push(id);
      
      await connection.query(`UPDATE solicitacoes SET ${setClause} WHERE id = ?`, values);
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
  const mockQuery = (id: number, updateData: Partial<Request>) => {
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
  
  return executeQuery(dbQuery, mockQuery, id, updateData);
};
