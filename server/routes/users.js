
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Função para obter nível de acesso baseado no cargo
const getNivelAcessoByCargo = (cargo) => {
  const cargoLower = cargo.toLowerCase();
  
  // Mapeamento de cargos para níveis de acesso
  const niveisAcesso = {
    'administrador': {
      nivel: 'verde',
      descricao: 'Administrador',
      permissoes: {
        compra_impeditivos: 1,
        compra_consumo: 1,
        compra_estoque: 1,
        compra_locais: 1,
        compra_investimentos: 1,
        compra_alojamentos: 1,
        compra_supermercados: 1,
        aprova_solicitacao: 1
      }
    },
    'gerente': {
      nivel: 'azul',
      descricao: 'Gerente',
      permissoes: {
        compra_impeditivos: 1,
        compra_consumo: 1,
        compra_estoque: 1,
        compra_locais: 1,
        compra_investimentos: 1,
        compra_alojamentos: 0,
        compra_supermercados: 0,
        aprova_solicitacao: 1
      }
    },
    'supervisor': {
      nivel: 'marrom',
      descricao: 'Supervisor',
      permissoes: {
        compra_impeditivos: 1,
        compra_consumo: 1,
        compra_estoque: 1,
        compra_locais: 0,
        compra_investimentos: 0,
        compra_alojamentos: 0,
        compra_supermercados: 0,
        aprova_solicitacao: 1
      }
    },
    'comprador': {
      nivel: 'amarelo',
      descricao: 'Comprador',
      permissoes: {
        compra_impeditivos: 1,
        compra_consumo: 1,
        compra_estoque: 1,
        compra_locais: 0,
        compra_investimentos: 0,
        compra_alojamentos: 0,
        compra_supermercados: 0,
        aprova_solicitacao: 0
      }
    }
  };

  // Retorna o nível de acesso correspondente ou null se não encontrar
  return niveisAcesso[cargoLower] || null;
};

// GET TODOS FUNCIONÁRIOS
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.id, f.nome, f.email, f.cargo, f.status as ativo, f.departamento, f.matricula,
             n.descricao AS nivel_acesso, n.permissoes
      FROM tb_funcionarios f LEFT JOIN nivel_acesso n ON f.matricula = n.mat_funcionario
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
});

// GET FUNCIONÁRIO POR ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.id, f.nome, f.email, f.cargo, f.status as ativo, f.departamento, f.matricula,
             n.descricao AS nivel_acesso, n.permissoes
      FROM tb_funcionarios f LEFT JOIN nivel_acesso n ON f.matricula = n.mat_funcionario
      WHERE f.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).json({ message: 'Erro ao buscar funcionário' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [users] = await pool.query(`
      SELECT f.id, f.nome, f.email, f.cargo, f.status, f.departamento, f.matricula,
             n.descricao AS nivel_acesso
      FROM tb_funcionarios f
      LEFT JOIN nivel_acesso n ON f.matricula = n.mat_funcionario
      WHERE f.email = ? AND f.senha = ? AND f.status = 1
    `, [email, senha]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas ou usuário inativo' });
    }

    const user = users[0];

    const [nivel] = await pool.query(`
      SELECT 
        compra_impeditivos, compra_consumo, compra_estoque, compra_locais,
        compra_investimentos, compra_alojamentos, compra_supermercados,
        aprova_solicitacao
      FROM nivel_acesso
      WHERE mat_funcionario = ?
    `, [user.matricula]);

    user.permissoes = nivel.length > 0 ? {
      compra_impeditivos: nivel[0].compra_impeditivos ? 1 : 0,
      compra_consumo: nivel[0].compra_consumo ? 1 : 0,
      compra_estoque: nivel[0].compra_estoque ? 1 : 0,
      compra_locais: nivel[0].compra_locais ? 1 : 0,
      compra_investimentos: nivel[0].compra_investimentos ? 1 : 0,
      compra_alojamentos: nivel[0].compra_alojamentos ? 1 : 0,
      compra_supermercados: nivel[0].compra_supermercados ? 1 : 0,
      aprova_solicitacao: nivel[0].aprova_solicitacao ? 1 : 0
    } : null;

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        nivel_acesso: user.nivel_acesso,
        departamento: user.departamento,
        matricula: user.matricula,
        permissoes: user.permissoes
      }
    });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    res.status(500).json({ success: false, message: 'Erro ao realizar login' });
  }
});

// ALTERAR SENHA
router.patch('/:id/senha', async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  
  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ success: false, message: 'Senhas não informadas' });
  }
  
  try {
    // Verificar se a senha atual está correta
    const [user] = await pool.query('SELECT senha FROM tb_funcionarios WHERE id = ?', [req.params.id]);
    
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    if (user[0].senha !== senhaAtual) {
      return res.status(400).json({ success: false, message: 'Senha atual incorreta' });
    }
    
    // Atualizar senha
    await pool.query('UPDATE tb_funcionarios SET senha = ? WHERE id = ?', [novaSenha, req.params.id]);
    
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
  }
});

// POST CRIAR FUNCIONÁRIO
router.post('/', async (req, res) => {
  console.log('Dados recebidos:', req.body);
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { nome, email, cargo, status, departamento, senha, matricula, ativo } = req.body;

    // Use status OR ativo flag
    const isActive = status !== undefined ? (status === 1 || status === true) : 
                    (ativo !== undefined ? ativo : true);

    console.log('Dados processados:', { 
      nome, 
      email, 
      cargo, 
      status: isActive ? 1 : 0, 
      departamento, 
      matricula 
    });

    // Validar campos obrigatórios
    if (!nome || !email || !cargo || !senha || !matricula) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campos obrigatórios não preenchidos' 
      });
    }

    // Verificar se já existe usuário com mesmo email ou matrícula
    const [existingUsers] = await connection.query(
      'SELECT * FROM tb_funcionarios WHERE email = ? OR matricula = ?',
      [email, matricula]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email ou matrícula já cadastrados' 
      });
    }

    // Obter nível de acesso baseado no cargo
    const nivelAcesso = getNivelAcessoByCargo(cargo);
    if (!nivelAcesso) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cargo inválido' 
      });
    }

    console.log('Nível de acesso:', nivelAcesso);

    // Inserir funcionário
    const [result] = await connection.query(
      'INSERT INTO tb_funcionarios (nome, email, cargo, status, departamento, senha, matricula) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, email, cargo, isActive ? 1 : 0, departamento || null, senha, matricula]
    );

    console.log('Funcionário inserido com ID:', result.insertId);

    try {
      // Verificar estrutura da tabela nivel_acesso
      const [tableInfo] = await connection.query('DESCRIBE nivel_acesso');
      console.log('Estrutura da tabela nivel_acesso:', tableInfo);

      // Inserir nível de acesso
      if (tableInfo.some(column => column.Field === 'permissoes')) {
        // Nova estrutura
        await connection.query(
          'INSERT INTO nivel_acesso (mat_funcionario, nivel, descricao, permissoes) VALUES (?, ?, ?, ?)',
          [matricula, nivelAcesso.nivel, nivelAcesso.descricao, JSON.stringify(nivelAcesso.permissoes)]
        );
      } else {
        // Estrutura antiga
        await connection.query(
          `INSERT INTO nivel_acesso (
            mat_funcionario, nivel, descricao,
            compra_impeditivos, compra_consumo, compra_estoque,
            compra_locais, compra_investimentos, compra_alojamentos,
            compra_supermercados, aprova_solicitacao
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            matricula, nivelAcesso.nivel, nivelAcesso.descricao,
            nivelAcesso.permissoes.compra_impeditivos,
            nivelAcesso.permissoes.compra_consumo,
            nivelAcesso.permissoes.compra_estoque,
            nivelAcesso.permissoes.compra_locais,
            nivelAcesso.permissoes.compra_investimentos,
            nivelAcesso.permissoes.compra_alojamentos,
            nivelAcesso.permissoes.compra_supermercados,
            nivelAcesso.permissoes.aprova_solicitacao
          ]
        );
      }
    } catch (tableError) {
      console.error('Erro ao manipular nivel_acesso (continuando):', tableError);
      // Continue mesmo se houver erro com a tabela nivel_acesso
    }

    console.log('Nível de acesso inserido para matrícula:', matricula);

    await connection.commit();

    // Buscar usuário criado
    const [newUser] = await connection.query(
      `SELECT f.id, f.nome, f.email, f.cargo, f.status as ativo, f.departamento, f.matricula,
              n.descricao AS nivel_acesso
       FROM tb_funcionarios f
       LEFT JOIN nivel_acesso n ON f.matricula = n.mat_funcionario
       WHERE f.id = ?`,
      [result.insertId]
    );

    console.log('Usuário criado:', newUser[0]);

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      user: newUser.length > 0 ? newUser[0] : null,
      message: 'Usuário criado com sucesso'
    });
  } catch (err) {
    await connection.rollback();
    console.error('Erro ao criar funcionário:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar funcionário: ' + err.message 
    });
  } finally {
    connection.release();
  }
});

// ATUALIZAR FUNCIONÁRIO
router.put('/:id', async (req, res) => {
  const { nome, email, cargo, status, departamento, senha, matricula, ativo } = req.body;
  
  // Use status OR ativo flag
  const isActive = status !== undefined ? (status === 1 || status === true) : 
                  (ativo !== undefined ? ativo : true);
  
  try {
    let query = `
      UPDATE tb_funcionarios 
      SET nome = ?, email = ?, cargo = ?, status = ?, departamento = ?, matricula = ?
      WHERE id = ?
    `;
    let params = [nome, email, cargo, isActive ? 1 : 0, departamento, matricula, req.params.id];

    if (senha) {
      query = `
        UPDATE tb_funcionarios 
        SET nome = ?, email = ?, cargo = ?, status = ?, departamento = ?, matricula = ?, senha = ?
        WHERE id = ?
      `;
      params = [nome, email, cargo, isActive ? 1 : 0, departamento, matricula, senha, req.params.id];
    }

    await pool.query(query, params);
    
    // Atualizar o nível de acesso se o cargo foi alterado
    const nivelAcesso = getNivelAcessoByCargo(cargo);
    if (nivelAcesso) {
      try {
        const [exists] = await pool.query(
          'SELECT 1 FROM nivel_acesso WHERE mat_funcionario = ?',
          [matricula]
        );

        if (exists.length > 0) {
          // Atualizar
          await pool.query(`
            UPDATE nivel_acesso SET
              nivel = ?,
              descricao = ?
            WHERE mat_funcionario = ?
          `, [nivelAcesso.nivel, nivelAcesso.descricao, matricula]);
        } else {
          // Inserir
          await pool.query(`
            INSERT INTO nivel_acesso (
              mat_funcionario, nivel, descricao, 
              compra_impeditivos, compra_consumo, compra_estoque,
              compra_locais, compra_investimentos, compra_alojamentos,
              compra_supermercados, aprova_solicitacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            matricula, nivelAcesso.nivel, nivelAcesso.descricao,
            nivelAcesso.permissoes.compra_impeditivos,
            nivelAcesso.permissoes.compra_consumo,
            nivelAcesso.permissoes.compra_estoque,
            nivelAcesso.permissoes.compra_locais,
            nivelAcesso.permissoes.compra_investimentos,
            nivelAcesso.permissoes.compra_alojamentos,
            nivelAcesso.permissoes.compra_supermercados,
            nivelAcesso.permissoes.aprova_solicitacao
          ]);
        }
      } catch (nivelError) {
        console.error('Erro ao atualizar nível de acesso (não crítico):', nivelError);
        // Não falhar a requisição principal por causa deste erro
      }
    }
    
    res.status(200).json({ success: true, message: 'Funcionário atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar funcionário' });
  }
});

// Alterar status do usuário (ativar/desativar)
router.patch('/:id/status', async (req, res) => {
  const { ativo, status } = req.body;
  const id = req.params.id;
  
  // Use ativo OR status
  const isActive = ativo !== undefined ? ativo : (status !== undefined ? (status === 1 || status === true) : null);
  
  if (isActive === null) {
    return res.status(400).json({ success: false, message: 'Status não informado' });
  }
  
  try {
    // Verificar se usuário existe
    const [existingUser] = await pool.query('SELECT id FROM tb_funcionarios WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    // Atualizar status
    await pool.query('UPDATE tb_funcionarios SET status = ? WHERE id = ?', [isActive ? 1 : 0, id]);
    
    res.json({ success: true, message: 'Status do usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar status do usuário' });
  }
});

// CRIAR NÍVEL DE ACESSO
router.post('/nivel-acesso', async (req, res) => {
  const {
    matricula,
    descricao,
    compra_impeditivos,
    compra_consumo,
    compra_estoque,
    compra_locais,
    compra_investimentos,
    compra_alojamentos,
    compra_supermercados,
    aprova_solicitacao
  } = req.body;

  try {
    // Verifica se já existe um nível de acesso para a matrícula
    const [exists] = await pool.query(
      `SELECT 1 FROM nivel_acesso WHERE mat_funcionario = ?`,
      [matricula]
    );

    if (exists.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nível de acesso já existe para essa matrícula' 
      });
    }

    await pool.query(`
      INSERT INTO nivel_acesso (
        mat_funcionario,
        descricao,
        compra_impeditivos,
        compra_consumo,
        compra_estoque,
        compra_locais,
        compra_investimentos,
        compra_alojamentos,
        compra_supermercados,
        aprova_solicitacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      matricula,
      descricao,
      compra_impeditivos ? 1 : 0,
      compra_consumo ? 1 : 0,
      compra_estoque ? 1 : 0,
      compra_locais ? 1 : 0,
      compra_investimentos ? 1 : 0,
      compra_alojamentos ? 1 : 0,
      compra_supermercados ? 1 : 0,
      aprova_solicitacao ? 1 : 0
    ]);

    res.status(201).json({ success: true, message: 'Nível de acesso cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro ao inserir nível de acesso:', err);
    res.status(500).json({ success: false, message: 'Erro ao inserir nível de acesso' });
  }
});

// ATUALIZAR NÍVEL DE ACESSO
router.put('/nivel-acesso/:matricula', async (req, res) => {
  const {
    descricao,
    compra_impeditivos,
    compra_consumo,
    compra_estoque,
    compra_locais,
    compra_investimentos,
    compra_alojamentos,
    compra_supermercados,
    aprova_solicitacao
  } = req.body;

  try {
    await pool.query(`
      UPDATE nivel_acesso SET
        descricao = ?,
        compra_impeditivos = ?,
        compra_consumo = ?,
        compra_estoque = ?,
        compra_locais = ?,
        compra_investimentos = ?,
        compra_alojamentos = ?,
        compra_supermercados = ?,
        aprova_solicitacao = ?
      WHERE mat_funcionario = ?
    `, [
      descricao,
      compra_impeditivos ? 1 : 0,
      compra_consumo ? 1 : 0,
      compra_estoque ? 1 : 0,
      compra_locais ? 1 : 0,
      compra_investimentos ? 1 : 0,
      compra_alojamentos ? 1 : 0,
      compra_supermercados ? 1 : 0,
      aprova_solicitacao ? 1 : 0,
      req.params.matricula
    ]);

    res.status(200).json({ success: true, message: 'Nível de acesso atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar nível de acesso:', err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar nível de acesso' });
  }
});

module.exports = router;
