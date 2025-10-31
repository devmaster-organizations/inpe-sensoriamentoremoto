const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilita CORS para todas as rotas
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Rota proxy para a API de notícias (contorna CORS)
app.get('/api/noticias', async (req, res) => {
  try {
    console.log('🔄 Proxy: Fazendo requisição para API externa...');
    
    // Tenta diferentes endpoints (IP da máquina host)
    const apiUrls = [
      'http://192.168.18.140:3013/api/noticias',
      'http://host.docker.internal:3013/api/noticias',
      'http://victor-Latitude-3420:3013/api/noticias'
    ];
    
    let lastError;
    for (const url of apiUrls) {
      try {
        console.log(`Tentando: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Dados obtidos da API externa');
          return res.json(data);
        }
        
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.log(`❌ Falha em ${url}: ${error.message}`);
        lastError = error;
        continue;
      }
    }
    
    throw lastError || new Error('Nenhuma API disponível');
    
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