const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilita CORS para todas as rotas
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Rota proxy para a API de notícias (contorna CORS)
app.get('/api/noticias', async (_req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias`;
  try {
    console.log(`🔄 Proxy: requisitando ${targetUrl}`);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Dados obtidos da API externa');
    return res.json(data);
  } catch (error) {
    console.error('❌ Erro no proxy:', error.message);
    res.status(500).json({ 
      error: 'API não disponível', 
      message: error.message 
    });
  }
});

// Serve arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname)));

// Inicia o servidor
const PORT = process.env.PORT || 3021;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Projeto disponível em http://localhost:${PORT}`);
//   console.log(`🔄 Proxy API disponível em http://localhost:${PORT}/api/noticias`);
});