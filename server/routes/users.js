const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Mapeamento de cargos para níveis de acesso
const cargoToNivelAcesso = {
  'Levantador': 'amarelo',
  'Encarregado': 'amarelo',
  'Supervisão': 'azul',
  'Segurança': 'azul',
  'Coordenação': 'marrom',
  'Gerência': 'verde',
  'Diretoria': 'verde',
  // Fallback para cargos não mapeados
  'default': 'amarelo'
};

// Obter o nível de acesso com base no cargo
const getNivelAcessoByCargo = (cargo) => {
  return cargoToNivelAcesso[cargo] || cargoToNivelAcesso.default;
};

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
  console.log('Dados recebidos:', req.body);
  
  let { nome, email, cargo, nivel_acesso, ativo, departamento, senha, matricula, status } = req.body;
  
  if (!nome || !email || !cargo || !senha || !matricula) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos' });
  }
  
  // Se nivel_acesso não foi fornecido, determinar pelo cargo
  if (!nivel_acesso) {
    nivel_acesso = getNivelAcessoByCargo(cargo);
  }
  
  // Se status foi fornecido em vez de ativo, usar o status
  if (status !== undefined && ativo === undefined) {
    ativo = status === 1 || status === true;
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
    `, [nome, email, cargo, nivel_acesso, ativo ? 1 : 0, departamento || null, senha, matricula]);
    
    console.log('Usuário criado com sucesso:', result);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Usuário criado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: `Erro ao criar usuário: ${error.message}` });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  let { nome, email, cargo, nivel_acesso, ativo, departamento, senha, matricula } = req.body;
  const id = req.params.id;
  
  if (!nome || !email || !cargo || !matricula) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos' });
  }
  
  // Se nivel_acesso não foi fornecido, determinar pelo cargo
  if (!nivel_acesso) {
    nivel_acesso = getNivelAcessoByCargo(cargo);
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
