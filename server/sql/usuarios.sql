
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  nivel_acesso ENUM('amarelo', 'azul', 'marrom', 'verde') NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  departamento VARCHAR(100),
  matricula VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para níveis de acesso com limites de compra
CREATE TABLE IF NOT EXISTS niveis_autorizacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(50) NOT NULL,
  descricao TEXT,
  compras_impeditivas DECIMAL(10,2) DEFAULT 0,
  compras_consumo DECIMAL(10,2) DEFAULT 0,
  compras_estoque DECIMAL(10,2) DEFAULT 0,
  compras_locais DECIMAL(10,2) DEFAULT 0,
  compras_investimentos DECIMAL(10,2) DEFAULT 0,
  alojamentos DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de centros de custo
CREATE TABLE IF NOT EXISTS centros_custo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descricao VARCHAR(255) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, cargo, nivel_acesso, matricula)
VALUES ('Administrador', 'admin@dineng.com.br', 'admin123', 'Administrador', 'verde', 'ADM001')
ON DUPLICATE KEY UPDATE email = 'admin@dineng.com.br';

-- Inserir alguns usuários para testes
INSERT INTO usuarios (nome, email, senha, cargo, nivel_acesso, departamento, matricula)
VALUES 
  ('João Silva', 'joao.silva@dineng.com.br', 'senha123', 'Gerente de Compras', 'verde', 'Compras', 'GC001'),
  ('Maria Oliveira', 'maria.oliveira@dineng.com.br', 'senha123', 'Supervisor de Compras', 'azul', 'Compras', 'SC001'),
  ('Carlos Santos', 'carlos.santos@dineng.com.br', 'senha123', 'Comprador', 'marrom', 'Compras', 'CP001'),
  ('Ana Souza', 'ana.souza@dineng.com.br', 'senha123', 'Solicitante', 'amarelo', 'Produção', 'SL001')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Inserir níveis de autorização
INSERT INTO niveis_autorizacao (nome, cor, descricao, compras_impeditivas, compras_consumo, compras_estoque, compras_locais, compras_investimentos, alojamentos)
VALUES 
  ('Levantador / Encarregado', 'Amarelo', 'Pode autorizar compras de até R$ 100 para itens de necessidade imediata', 100.00, 0.00, 0.00, 100.00, 0.00, 0.00),
  ('Supervisão / Segurança', 'Azul', 'Pode autorizar compras de até R$ 200, garantindo a continuidade das operações', 200.00, 200.00, 200.00, 200.00, 0.00, 0.00),
  ('Coordenação', 'Marrom', 'Pode aprovar compras de até R$ 1000, gerenciando recursos de médio porte', 1000.00, 1000.00, 1000.00, 1000.00, 1000.00, 1000.00),
  ('Gerência / Diretoria', 'Verde', 'Autoriza compras acima de R$ 1000, sendo responsável por decisões estratégicas', 10000.00, 10000.00, 10000.00, 10000.00, 10000.00, 10000.00)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Inserir alguns centros de custo para teste
INSERT INTO centros_custo (codigo, descricao, ativo)
VALUES 
  ('CC001', 'Administrativo', 1),
  ('CC002', 'Produção', 1),
  ('CC003', 'Comercial', 1),
  ('CC004', 'Manutenção', 1),
  ('CC005', 'Logística', 1)
ON DUPLICATE KEY UPDATE codigo = VALUES(codigo);
