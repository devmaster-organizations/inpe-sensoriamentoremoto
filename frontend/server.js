// Carrega variáveis de ambiente do arquivo .env.dev
require('dotenv').config({ path: '.env.dev' });

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilita CORS para todas as rotas
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Rota proxy para a API de notícias (contorna CORS) - GET
app.get('/api/noticias', async (_req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias`;
  try {
    console.log(`🔄 Proxy: requisitando ${targetUrl}`);
    console.log(`📌 API_BASE_URL configurada: ${process.env.API_BASE_URL}`);
    
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Dados obtidos da API externa');
    return res.json(data);
  } catch (error) {
    console.error('❌ Erro no proxy:', error.message);
    console.error('🔍 Detalhes do erro:', error);
    res.status(500).json({ 
      error: 'API não disponível', 
      message: error.message 
    });
  }
});

// Rota proxy para a API de publicações (contorna CORS) - GET
app.get('/api/publicacoes', async (_req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/publicacoes`;
  try {
    console.log(`🔄 Proxy: requisitando ${targetUrl}`);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Publicações obtidas da API externa');
    return res.json(data);
  } catch (error) {
    console.error('❌ Erro no proxy /api/publicacoes:', error.message);
    res.status(500).json({ 
      error: 'API não disponível', 
      message: error.message 
    });
  }
});

// Rota proxy para a API de vagas (contorna CORS) - GET
app.get('/api/vagas', async (_req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/vagas`;
  try {
    console.log(`🔄 Proxy: requisitando ${targetUrl}`);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Vagas obtidas da API externa');
    return res.json(data);
  } catch (error) {
    console.error('❌ Erro no proxy /api/vagas:', error.message);
    res.status(500).json({ 
      error: 'API não disponível', 
      message: error.message 
    });
  }
});

// Proxy para criar notícia com upload (POST multipart)
// Encaminha a requisição como stream para o backend, preservando headers e body
app.post('/api/noticias', (req, res) => {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
    const target = new URL(`${API_BASE_URL}/api/noticias`);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');

    const headers = { ...req.headers };
    // Ajusta Host para o alvo
    headers.host = target.host;

    const options = {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: 'POST',
      headers,
    };

    const proxyReq = httpMod.request(options, proxyRes => {
      res.status(proxyRes.statusCode || 500);
      // Copia cabeçalhos relevantes
      Object.entries(proxyRes.headers).forEach(([k, v]) => {
        try { if (typeof v !== 'undefined') res.setHeader(k, v); } catch (e) {}
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('❌ Erro no proxy POST /api/noticias:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar upload' });
    });

    // Encaminha o corpo da requisição (multipart) como stream
    req.pipe(proxyReq);
  } catch (err) {
    console.error('❌ Falha ao preparar proxy POST /api/noticias:', err.message);
    res.status(500).json({ error: 'Erro interno no proxy' });
  }
});

// Proxy para criar publicação com upload (POST multipart)
app.post('/api/publicacoes', (req, res) => {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
    const target = new URL(`${API_BASE_URL}/api/publicacoes`);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');

    const headers = { ...req.headers };
    headers.host = target.host;

    const options = {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: 'POST',
      headers,
    };

    const proxyReq = httpMod.request(options, proxyRes => {
      res.status(proxyRes.statusCode || 500);
      Object.entries(proxyRes.headers).forEach(([k, v]) => {
        try { if (typeof v !== 'undefined') res.setHeader(k, v); } catch (e) {}
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('❌ Erro no proxy POST /api/publicacoes:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar upload' });
    });

    req.pipe(proxyReq);
  } catch (err) {
    console.error('❌ Falha ao preparar proxy POST /api/publicacoes:', err.message);
    res.status(500).json({ error: 'Erro interno no proxy' });
  }
});

// Proxy para criar vaga com upload (POST multipart)
app.post('/api/vagas', (req, res) => {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
    const target = new URL(`${API_BASE_URL}/api/vagas`);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');

    const headers = { ...req.headers };
    headers.host = target.host;

    const options = {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: 'POST',
      headers,
    };

    const proxyReq = httpMod.request(options, proxyRes => {
      res.status(proxyRes.statusCode || 500);
      Object.entries(proxyRes.headers).forEach(([k, v]) => {
        try { if (typeof v !== 'undefined') res.setHeader(k, v); } catch (e) {}
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('❌ Erro no proxy POST /api/vagas:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar upload' });
    });

    req.pipe(proxyReq);
  } catch (err) {
    console.error('❌ Falha ao preparar proxy POST /api/vagas:', err.message);
    res.status(500).json({ error: 'Erro interno no proxy' });
  }
});

// Proxy para arquivos servidos pelo backend em /uploads (somente GET)
// Usa RegExp para compatibilidade total com path-to-regexp (captura tudo após /uploads/)
app.get(/^\/uploads\/(.*)$/, async (req, res) => {
  const subpath = req.params[0];
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/uploads/${subpath}`;
  try {
    console.log(`🖼️  Proxy uploads: requisitando ${targetUrl}`);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).end();
    }
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set('Content-Type', contentType);
    return res.send(buffer);
  } catch (error) {
    console.error('❌ Erro no proxy de uploads:', error.message);
    res.status(502).send('Erro ao obter arquivo');
  }
});

// Serve arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname)));

// Inicia o servidor
const PORT = process.env.PORT || 3021;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Projeto disponível em http://localhost:${PORT}`);
  console.log(`🔗 API_BASE_URL: ${process.env.API_BASE_URL || 'http://server:3013'}`);
});