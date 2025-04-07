
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Obter todos os usuários
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome, email, cargo, nivel_acesso, ativo, departamento, matricula
      FROM usuarios
      ORDER BY nome
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
  }
});

// Obter usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome, email, cargo, nivel_acesso, ativo, departamento, matricula
      FROM usuarios
      WHERE id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuário' });
  }
});

// Criar novo usuário
router.post('/', async (req, res) => {
  const { nome, email, cargo, nivel_acesso, ativo, departamento, senha, matricula } = req.body;
  
  if (!nome || !email || !cargo || !nivel_acesso || !senha || !matricula) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos' });
  }
  
  try {
    // Verificar se email já existe
    const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    }
    
    // Inserir novo usuário
    const [result] = await pool.query(`
      INSERT INTO usuarios (nome, email, cargo, nivel_acesso, ativo, departamento, senha, matricula)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nome, email, cargo, nivel_acesso, ativo ? 1 : 0, departamento, senha, matricula]);
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { nome, email, cargo, nivel_acesso, ativo, departamento, senha, matricula } = req.body;
  const id = req.params.id;
  
  if (!nome || !email || !cargo || !nivel_acesso || !matricula) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos' });
  }
  
  try {
    // Verificar se usuário existe
    const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    let query = `
      UPDATE usuarios 
      SET nome = ?, email = ?, cargo = ?, nivel_acesso = ?, ativo = ?, departamento = ?, matricula = ?
      WHERE id = ?
    `;
    
    let params = [nome, email, cargo, nivel_acesso, ativo ? 1 : 0, departamento, matricula, id];
    
    // Se senha foi fornecida, atualize-a também
    if (senha) {
      query = `
        UPDATE usuarios 
        SET nome = ?, email = ?, cargo = ?, nivel_acesso = ?, ativo = ?, departamento = ?, matricula = ?, senha = ?
        WHERE id = ?
      `;
      params = [nome, email, cargo, nivel_acesso, ativo ? 1 : 0, departamento, matricula, senha, id];
    }
    
    // Atualizar usuário
    await pool.query(query, params);
    
    res.json({ success: true, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
  }
});

// Alterar status do usuário (ativar/desativar)
router.patch('/:id/status', async (req, res) => {
  const { ativo } = req.body;
  const id = req.params.id;
  
  if (ativo === undefined) {
    return res.status(400).json({ success: false, message: 'Status não informado' });
  }
  
  try {
    // Verificar se usuário existe
    const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    // Atualizar status
    await pool.query('UPDATE usuarios SET ativo = ? WHERE id = ?', [ativo ? 1 : 0, id]);
    
    res.json({ success: true, message: 'Status do usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar status do usuário' });
  }
});

// Alterar senha
router.patch('/:id/senha', async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const id = req.params.id;
  
  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ success: false, message: 'Senhas não informadas' });
  }
  
  try {
    // Verificar se a senha atual está correta
    const [user] = await pool.query('SELECT senha FROM usuarios WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    if (user[0].senha !== senhaAtual) {
      return res.status(400).json({ success: false, message: 'Senha atual incorreta' });
    }
    
    // Atualizar senha
    await pool.query('UPDATE usuarios SET senha = ? WHERE id = ?', [novaSenha, id]);
    
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
  }
});

// Autenticar usuário (login)
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
  }
  
  try {
    const [users] = await pool.query(`
      SELECT id, nome, email, cargo, nivel_acesso, ativo, departamento, matricula
      FROM usuarios 
      WHERE email = ? AND senha = ? AND ativo = 1
    `, [email, senha]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
    }
    
    const user = users[0];
    
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        nivel_acesso: user.nivel_acesso,
        departamento: user.departamento,
        matricula: user.matricula
      }
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao autenticar usuário' });
  }
});

// Obter todos os níveis de autorização
router.get('/niveis-autorizacao', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM niveis_autorizacao ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar níveis de autorização:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar níveis de autorização' });
  }
});

module.exports = router;
