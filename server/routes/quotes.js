
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todas as cotações
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM compra_cotacao');
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
      SELECT * FROM compra_solicitacao 
      WHERE status = 'Aprovado' OR status = 'Em Cotação'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar solicitações para cotação:', error);
    res.status(500).json({ message: 'Erro ao buscar solicitações para cotação', error: error.message });
  }
});

// Obter cotações por ID de solicitação
router.get('/by-request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const [rows] = await pool.query('SELECT * FROM compra_cotacao WHERE solicitacao_id = ?', [requestId]);
    
    // Formatar os dados para o formato esperado pelo componente QuoteComparison
    const formattedData = [];
    
    for (const row of rows) {
      // Buscar detalhes dos itens desta cotação
      const [items] = await pool.query(`
        SELECT i.* FROM compra_tb_itens i
        WHERE i.solicitacao_id = ?
      `, [row.id]);
      
      // Formatar para o formato esperado
      formattedData.push({
        id: row.id,
        supplierId: row.fornecedor_id,
        supplierName: row.fornecedor,
        items: items.map(item => ({
          id: item.id,
          itemName: item.descricao,
          quantity: item.quantidade,
          price: item.valor_unitario,
          supplierId: row.fornecedor_id
        }))
      });
    }
    
    res.json(formattedData);
  } catch (error) {
    console.error(`Erro ao buscar cotações para a solicitação ${req.params.requestId}:`, error);
    res.status(500).json({ message: 'Erro ao buscar cotações', error: error.message });
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
      `INSERT INTO compra_cotacao 
       (solicitacao_id, fornecedor, preco, prazo_entrega, condicoes,status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
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
    
    // Se tiver itens, inserir cada um
    if (quoteData.items && quoteData.items.length > 0) {
      for (const item of quoteData.items) {
        await connection.query(
          `INSERT INTO compra_cotacao 
           (solicitacao_id, id_tb_item, quantidade,) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            quoteId,
            item.description || item.itemName,
            item.quantity,
            item.price,
            item.price * item.quantity,
            item.supplierId
          ]
        );
      }
    }
    
    // Atualizar a solicitação para status "Em Cotação" se necessário
    await connection.query(`
      UPDATE compra_solicitacao 
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
    
    let query = 'UPDATE compra_cotacao SET status = ?';
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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { requestId } = req.params;
    const { selectedItems } = req.body;
    
    // Calcular valor total
    const totalValue = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Agrupar itens por fornecedor
    const supplierGroups = {};
    selectedItems.forEach(item => {
      if (!supplierGroups[item.supplierId]) {
        supplierGroups[item.supplierId] = [];
      }
      supplierGroups[item.supplierId].push(item);
    });
    
    // Marcar cotações aprovadas e rejeitadas
    for (const supplierId in supplierGroups) {
      // Marcar esta cotação como aprovada
      await connection.query(
        `UPDATE compra_cotacao SET status = 'Aprovada' WHERE solicitacao_id = ? AND fornecedor_id = ?`,
        [requestId, supplierId]
      );
    }
    
    // Marcar outras cotações como rejeitadas
    await connection.query(
      `UPDATE compra_cotacao SET status = 'Rejeitada' 
       WHERE solicitacao_id = ? AND status = 'Em Cotação' AND fornecedor_id NOT IN (?)`,
      [requestId, Object.keys(supplierGroups)]
    );
    
    // Atualizar status da solicitação
    await connection.query(
      `UPDATE compra_solicitacao SET status = 'Em Compra' WHERE id = ?`,
      [requestId]
    );
    
    await connection.commit();
    res.json({
      success: true,
      requestId,
      totalValue,
      supplierGroups,
      message: 'Cotação finalizada com sucesso'
    });
  } catch (error) {
    await connection.rollback();
    console.error(`Erro ao finalizar cotação para solicitação ${req.params.requestId}:`, error);
    res.status(500).json({ message: 'Erro ao finalizar cotação', error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
