
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: '192.168.0.249',
  user: 'dineng',
  password: 'dineng@@2025',
  database: 'sisdineng'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Generic query function
export const query = async (sql: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Functions for specific database operations

// Get all requests
export const getAllRequests = async () => {
  return query(`
    SELECT * FROM solicitacoes 
    ORDER BY data_solicitacao DESC
  `);
};

// Get request by ID with items
export const getRequestById = async (id: number) => {
  try {
    // Get request details
    const requests = await query('SELECT * FROM solicitacoes WHERE id = ?', [id]);
    
    if (!requests || (requests as any[]).length === 0) {
      return null;
    }
    
    const request = (requests as any[])[0];
    
    // Get request items
    const items = await query('SELECT * FROM tb_item WHERE solicitacao_id = ?', [id]);
    
    // Get approvals
    const approvals = await query('SELECT * FROM aprovacoes WHERE solicitacao_id = ? ORDER BY data_aprovacao', [id]);
    
    // Get quotes
    const quotes = await query('SELECT * FROM cotacoes WHERE solicitacao_id = ?', [id]);
    
    return {
      ...request,
      items,
      approvals,
      quotes
    };
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    throw error;
  }
};

// Create new request
export const createRequest = async (requestData: any, items: any[]) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert request
    const [result] = await connection.execute(
      `INSERT INTO solicitacoes (
        nome_solicitante, 
        aplicacao, 
        centro_custo, 
        data_solicitacao, 
        local_entrega, 
        prazo_entrega, 
        categoria, 
        motivo, 
        prioridade,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestData.requesterName,
        requestData.application,
        requestData.costCenter,
        requestData.requestDate,
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
      await connection.execute(
        'INSERT INTO tb_item (solicitacao_id, descricao, quantidade, id_solicitante) VALUES (?, ?, ?, ?)',
        [requestId, item.description, item.quantity, 1] // Assuming id_solicitante is the logged user ID
      );
    }
    
    await connection.commit();
    return requestId;
  } catch (error) {
    await connection.rollback();
    console.error('Error creating request:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Update request status
export const updateRequestStatus = async (id: number, status: string, approvalData?: any) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Update request status
    await connection.execute(
      'UPDATE solicitacoes SET status = ? WHERE id = ?',
      [status, id]
    );
    
    // Add approval record if provided
    if (approvalData) {
      await connection.execute(
        `INSERT INTO aprovacoes (
          solicitacao_id, 
          etapa, 
          status, 
          aprovado_por, 
          nivel_aprovacao, 
          motivo_rejeicao
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          approvalData.etapa,
          approvalData.status,
          approvalData.aprovado_por,
          approvalData.nivel_aprovacao,
          approvalData.motivo_rejeicao || null
        ]
      );
    }
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error updating request status:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Create quote
export const createQuote = async (quoteData: any) => {
  return query(
    `INSERT INTO cotacoes (
      solicitacao_id, 
      fornecedor, 
      preco, 
      prazo_entrega, 
      condicoes, 
      nivel_aprovacao, 
      status
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
};

// Update quote status
export const updateQuoteStatus = async (id: number, status: string, approvedBy?: string, approvalLevel?: string) => {
  return query(
    'UPDATE cotacoes SET status = ?, aprovado_por = ?, nivel_aprovacao = ? WHERE id = ?',
    [status, approvedBy, approvalLevel, id]
  );
};
