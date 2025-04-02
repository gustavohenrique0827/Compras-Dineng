
# SISDINENG - Sistema de Compras

## Estrutura do Projeto

Este projeto é composto por duas partes principais:

1. **Frontend** - Uma aplicação React que roda no navegador
2. **Backend** - Uma API Node.js/Express que se conecta ao banco de dados MySQL

## Configuração do Ambiente

### Pré-requisitos

- Node.js (v14 ou superior)
- MySQL Server (configurado conforme as credenciais em server/.env)

### Instalação

1. Clone o repositório
2. Instale as dependências do frontend:
   ```
   npm install
   ```
3. Instale as dependências do backend:
   ```
   cd server
   npm install
   ```

### Banco de Dados

O sistema está configurado para conectar a um banco de dados MySQL com as seguintes credenciais:

- Host: 192.168.0.249
- Usuário: dineng
- Senha: dineng@@2025
- Banco: sisdineng
- Porta: 3306

Para configurar o banco de dados, você precisará:

1. Criar o banco de dados sisdineng
2. Criar as tabelas necessárias (veja a estrutura abaixo)

### Estrutura do Banco de Dados

```sql
-- Exemplo de estrutura do banco de dados
CREATE TABLE solicitacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_solicitante VARCHAR(100) NOT NULL,
  aplicacao VARCHAR(100) NOT NULL,
  centro_custo VARCHAR(50) NOT NULL,
  data_solicitacao DATE NOT NULL,
  local_entrega VARCHAR(100) NOT NULL,
  prazo_entrega DATE NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  motivo TEXT NOT NULL,
  prioridade VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL
);

CREATE TABLE itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(200) NOT NULL,
  quantidade INT NOT NULL,
  solicitacao_id INT NOT NULL,
  id_solicitante INT NOT NULL,
  FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
);

CREATE TABLE aprovacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitacao_id INT NOT NULL,
  etapa VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  aprovado_por VARCHAR(100) NOT NULL,
  nivel_aprovacao VARCHAR(50) NOT NULL,
  data_aprovacao DATE NOT NULL,
  motivo_rejeicao TEXT,
  FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
);

CREATE TABLE cotacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitacao_id INT NOT NULL,
  fornecedor VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  prazo_entrega VARCHAR(50) NOT NULL,
  condicoes TEXT NOT NULL,
  nivel_aprovacao VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  aprovado_por VARCHAR(100),
  FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
);

CREATE TABLE fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  contato VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  endereco TEXT NOT NULL
);
```

## Executando o Projeto

### Desenvolvimento

1. Inicie o servidor backend:
   ```
   cd server
   npm run dev
   ```
   O servidor estará rodando em http://localhost:5000

2. Em outro terminal, inicie o frontend:
   ```
   npm run dev
   ```
   O frontend estará disponível em http://localhost:3000

### Produção

Para ambiente de produção, você precisará:

1. Construir o frontend:
   ```
   npm run build
   ```

2. Configurar um servidor web (como Nginx ou Apache) para servir os arquivos estáticos gerados na pasta "dist"

3. Iniciar o servidor backend:
   ```
   cd server
   npm start
   ```

## Funcionamento do Sistema

Este sistema tem um mecanismo de fallback inteligente:

- Tenta primeiro se conectar ao backend Node.js/Express
- Se não conseguir, automaticamente cai para dados simulados locais

Isso permite que o aplicativo funcione mesmo quando o backend não está disponível, facilitando o desenvolvimento e demonstrações.

## Recursos Principais

- Gerenciamento de solicitações de compra
- Aprovação de solicitações
- Gestão de cotações com múltiplos fornecedores
- Cadastro e manutenção de fornecedores
- Relatórios e dashboards
