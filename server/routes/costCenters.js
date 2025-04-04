
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todos os centros de custo
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM centros_custo ORDER BY codigo');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar centros de custo' });
  }
});

// Obter centro de custo por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM centros_custo WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Centro de custo não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar centro de custo:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar centro de custo' });
  }
});

// Criar novo centro de custo
router.post('/', async (req, res) => {
  const { codigo, descricao, ativo = true } = req.body;
  
  if (!codigo || !descricao) {
    return res.status(400).json({ success: false, message: 'Código e descrição são obrigatórios' });
  }
  
  try {
    // Verificar se código já existe
    const [existingCenter] = await pool.query('SELECT id FROM centros_custo WHERE codigo = ?', [codigo]);
    
    if (existingCenter.length > 0) {
      return res.status(400).json({ success: false, message: 'Código já cadastrado' });
    }
    
    // Inserir novo centro de custo
    const [result] = await pool.query(
      'INSERT INTO centros_custo (codigo, descricao, ativo) VALUES (?, ?, ?)',
      [codigo, descricao, ativo ? 1 : 0]
    );
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar centro de custo:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar centro de custo' });
  }
});

// Atualizar centro de custo
router.put('/:id', async (req, res) => {
  const { codigo, descricao, ativo } = req.body;
  const id = req.params.id;
  
  if (!codigo || !descricao) {
    return res.status(400).json({ success: false, message: 'Código e descrição são obrigatórios' });
  }
  
  try {
    // Verificar se o centro de custo existe
    const [existingCenter] = await pool.query('SELECT id FROM centros_custo WHERE id = ?', [id]);
    
    if (existingCenter.length === 0) {
      return res.status(404).json({ success: false, message: 'Centro de custo não encontrado' });
    }
    
    // Verificar se o código já está em uso por outro centro de custo
    const [codeExists] = await pool.query(
      'SELECT id FROM centros_custo WHERE codigo = ? AND id != ?',
      [codigo, id]
    );
    
    if (codeExists.length > 0) {
      return res.status(400).json({ success: false, message: 'Código já está em uso por outro centro de custo' });
    }
    
    // Atualizar centro de custo
    await pool.query(
      'UPDATE centros_custo SET codigo = ?, descricao = ?, ativo = ? WHERE id = ?',
      [codigo, descricao, ativo ? 1 : 0, id]
    );
    
    res.json({ success: true, message: 'Centro de custo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar centro de custo:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar centro de custo' });
  }
});

// Remover centro de custo
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM centros_custo WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Centro de custo não encontrado' });
    }
    
    res.json({ success: true, message: 'Centro de custo removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover centro de custo:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover centro de custo' });
  }
});

module.exports = router;
