
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  nivel_acesso ENUM('admin', 'gerente', 'supervisor', 'comprador', 'solicitante') NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  departamento VARCHAR(100),
  telefone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, cargo, nivel_acesso)
VALUES ('Administrador', 'admin@dineng.com.br', 'admin123', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE email = 'admin@dineng.com.br';

-- Inserir alguns usuários para testes
INSERT INTO usuarios (nome, email, senha, cargo, nivel_acesso, departamento, telefone)
VALUES 
  ('João Silva', 'joao.silva@dineng.com.br', 'senha123', 'Gerente de Compras', 'gerente', 'Compras', '(11) 98888-8888'),
  ('Maria Oliveira', 'maria.oliveira@dineng.com.br', 'senha123', 'Supervisor de Compras', 'supervisor', 'Compras', '(11) 97777-7777'),
  ('Carlos Santos', 'carlos.santos@dineng.com.br', 'senha123', 'Comprador', 'comprador', 'Compras', '(11) 96666-6666'),
  ('Ana Souza', 'ana.souza@dineng.com.br', 'senha123', 'Solicitante', 'solicitante', 'Produção', '(11) 95555-5555')
ON DUPLICATE KEY UPDATE email = VALUES(email);
