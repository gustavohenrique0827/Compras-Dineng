
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todas as solicitações
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solicitacoes');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({ message: 'Erro ao buscar solicitações', error: error.message });
  }
});

// Obter uma solicitação por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [request] = await pool.query('SELECT * FROM solicitacoes WHERE id = ?', [id]);
    
    if (request.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }
    
    // Buscar itens relacionados
    const [items] = await pool.query('SELECT * FROM itens WHERE solicitacao_id = ?', [id]);
    
    // Buscar aprovações relacionadas
    const [approvals] = await pool.query('SELECT * FROM aprovacoes WHERE solicitacao_id = ?', [id]);
    
    // Buscar cotações relacionadas
    const [quotes] = await pool.query('SELECT * FROM cotacoes WHERE solicitacao_id = ?', [id]);
    
    res.json({
      ...request[0],
      items,
      approvals,
      quotes
    });
  } catch (error) {
    console.error(`Erro ao buscar solicitação com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar solicitação', error: error.message });
  }
});

// Criar nova solicitação
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { requestData, items } = req.body;
    
    // Inserir solicitação principal
    const [result] = await connection.query(
      `INSERT INTO solicitacoes 
       (nome_solicitante, aplicacao, centro_custo, data_solicitacao, 
        local_entrega, prazo_entrega, categoria, motivo, prioridade, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    
    const requestId = result.insertId;
    
    // Inserir itens
    for (const item of items) {
      await connection.query(
        `INSERT INTO itens (descricao, quantidade, solicitacao_id, id_solicitante) 
         VALUES (?, ?, ?, ?)`,
        [item.description, item.quantity, requestId, 1] // 1 é um ID de solicitante padrão
      );
    }
    
    await connection.commit();
    res.status(201).json({ id: requestId, message: 'Solicitação criada com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ message: 'Erro ao criar solicitação', error: error.message });
  } finally {
    connection.release();
  }
});

// Atualizar status da solicitação
router.patch('/:id/status', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { status, approvalData } = req.body;
    
    // Atualizar status da solicitação
    await connection.query(
      'UPDATE solicitacoes SET status = ? WHERE id = ?',
      [status, id]
    );
    
    // Adicionar registro de aprovação, se fornecido
    if (approvalData) {
      await connection.query(
        `INSERT INTO aprovacoes 
         (solicitacao_id, etapa, status, aprovado_por, nivel_aprovacao, motivo_rejeicao, data_aprovacao) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
    res.json({ success: true, message: 'Status atualizado com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error(`Erro ao atualizar status da solicitação ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar status', error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
