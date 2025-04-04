
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');
const requestsRoutes = require('./routes/requests');
const quotesRoutes = require('./routes/quotes');
const suppliersRoutes = require('./routes/suppliers');
const usersRoutes = require('./routes/users');
const costCentersRoutes = require('./routes/costCenters');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Permitir qualquer origem em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Adicionando log para depuração
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Teste de conexão ao iniciar o servidor
app.get('/api/test-connection', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ success: true, message: 'Conexão com banco de dados estabelecida!' });
  } else {
    res.status(500).json({ success: false, message: 'Falha na conexão com o banco de dados' });
  }
});

// Rotas
app.use('/api/requests', requestsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cost-centers', costCentersRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do SISDINENG está rodando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  testConnection();
});
