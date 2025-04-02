
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todas as cotações
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cotacoes');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar cotações:', error);
    res.status(500).json({ message: 'Erro ao buscar cotações', error: error.message });
  }
});

// Obter solicitações disponíveis para cotação
router.get('/requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM solicitacoes 
      WHERE status = 'Aprovado' OR status = 'Em Cotação'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar solicitações para cotação:', error);
    res.status(500).json({ message: 'Erro ao buscar solicitações para cotação', error: error.message });
  }
});

// Criar nova cotação
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const quoteData = req.body;
    
    // Inserir cotação principal
    const [result] = await connection.query(
      `INSERT INTO cotacoes 
       (solicitacao_id, fornecedor, preco, prazo_entrega, condicoes, nivel_aprovacao, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        quoteData.requestId,
        quoteData.fornecedor || 'Fornecedor não especificado',
        quoteData.totalValue || 0,
        quoteData.prazo_entrega || '5 dias úteis',
        quoteData.condicoes || 'Condições padrão',
        quoteData.approvalLevel || 'Gerência',
        quoteData.status || 'Em Cotação'
      ]
    );
    
    const quoteId = result.insertId;
    
    // Atualizar a solicitação para status "Em Cotação" se necessário
    await connection.query(`
      UPDATE solicitacoes 
      SET status = 'Em Cotação' 
      WHERE id = ? AND status = 'Aprovado'
    `, [quoteData.requestId]);
    
    await connection.commit();
    res.status(201).json({ id: quoteId, message: 'Cotação criada com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar cotação:', error);
    res.status(500).json({ message: 'Erro ao criar cotação', error: error.message });
  } finally {
    connection.release();
  }
});

// Atualizar status da cotação
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvalLevel } = req.body;
    
    let query = 'UPDATE cotacoes SET status = ?';
    const params = [status];
    
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
    
    await pool.query(query, params);
    
    res.json({ success: true, message: 'Status da cotação atualizado com sucesso' });
  } catch (error) {
    console.error(`Erro ao atualizar cotação ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar cotação', error: error.message });
  }
});

// Finalizar cotação (simula seleção final de itens)
router.post('/:requestId/finalize', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { selectedItems } = req.body;
    
    // Aqui você implementaria a lógica para salvar a seleção final no banco de dados
    // Este é um exemplo básico, você precisaria adaptar conforme seu esquema de banco de dados
    
    console.log(`Finalizando cotação para solicitação ${requestId} com itens:`, selectedItems);
    
    const totalValue = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      requestId,
      totalValue,
      message: 'Cotação finalizada com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao finalizar cotação para solicitação ${req.params.requestId}:`, error);
    res.status(500).json({ message: 'Erro ao finalizar cotação', error: error.message });
  }
});

module.exports = router;
