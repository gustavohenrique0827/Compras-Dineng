
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todos os fornecedores
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fornecedores');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ message: 'Erro ao buscar fornecedores', error: error.message });
  }
});

// Obter um fornecedor por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM fornecedores WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar fornecedor com ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar fornecedor', error: error.message });
  }
});

// Criar novo fornecedor
router.post('/', async (req, res) => {
  try {
    const supplierData = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO fornecedores (nome, categoria, contato, telefone, email, endereco) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        supplierData.nome,
        supplierData.categoria,
        supplierData.contato,
        supplierData.telefone,
        supplierData.email,
        supplierData.endereco
      ]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Fornecedor criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ message: 'Erro ao criar fornecedor', error: error.message });
  }
});

// Atualizar fornecedor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supplierData = req.body;
    
    await pool.query(
      `UPDATE fornecedores 
       SET nome = ?, categoria = ?, contato = ?, telefone = ?, email = ?, endereco = ? 
       WHERE id = ?`,
      [
        supplierData.nome,
        supplierData.categoria,
        supplierData.contato,
        supplierData.telefone,
        supplierData.email,
        supplierData.endereco,
        id
      ]
    );
    
    res.json({ success: true, message: 'Fornecedor atualizado com sucesso' });
  } catch (error) {
    console.error(`Erro ao atualizar fornecedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar fornecedor', error: error.message });
  }
});

// Excluir fornecedor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fornecedores WHERE id = ?', [id]);
    res.json({ success: true, message: 'Fornecedor excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir fornecedor ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao excluir fornecedor', error: error.message });
  }
});

module.exports = router;
