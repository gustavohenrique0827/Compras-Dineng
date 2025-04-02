
// Conexão com o banco de dados MySQL
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: '192.168.0.249',
  user: 'dineng',
  password: 'dineng@@2025',
  database: 'sisdineng',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error);
    return false;
  }
};

// Exporta o pool e a função de teste
module.exports = { pool, testConnection };
