// Carrega variáveis de ambiente do arquivo .env.dev
require('dotenv').config({ path: '.env.dev' });

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilita CORS para todas as rotas
app.use(cors());

// Desativa ETag para evitar responses 304 que quebram parsing em fetch após criação
app.disable('etag');

// Middleware para parsing JSON
app.use(express.json());

// Rota proxy para a API de notícias (contorna CORS) - GET
app.get('/api/noticias', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  // Repassa os query parameters (ex: admin=true)
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `${API_BASE_URL}/api/noticias${queryString ? '?' + queryString : ''}`;
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
app.get('/api/publicacoes', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  // Repassa os query parameters (ex: admin=true)
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `${API_BASE_URL}/api/publicacoes${queryString ? '?' + queryString : ''}`;
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

// Proxy obter publicação por ID - GET /api/publicacoes/:id
app.get('/api/publicacoes/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/publicacoes/${req.params.id}`;
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy GET /api/publicacoes/:id:', error.message);
    res.status(502).json({ error: 'Erro ao obter publicação', message: error.message });
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

// Rota proxy para a API de oportunidades (contorna CORS) - GET
app.get('/api/oportunidades', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  // Repassa os query parameters (ex: admin=true)
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `${API_BASE_URL}/api/oportunidades${queryString ? '?' + queryString : ''}`;
  try {
    console.log(`🔄 Proxy: requisitando ${targetUrl}`);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Oportunidades obtidas da API externa');
    return res.json(data);
  } catch (error) {
    console.error('❌ Erro no proxy /api/oportunidades:', error.message);
    res.status(500).json({ 
      error: 'API não disponível', 
      message: error.message 
    });
  }
});

// Proxy para criar notícia (JSON ou multipart) - POST
app.post('/api/noticias', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias`;
  const contentType = req.headers['content-type'] || '';
  try {
    // Encaminhamento otimizado para JSON evita travamento de stream
    if (contentType.includes('application/json')) {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      });
      const text = await response.text();
      res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
      return;
    }
    // Caso contrário trata como multipart (stream)
    const target = new URL(targetUrl);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');
    const headers = { ...req.headers, host: target.host };
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
      Object.entries(proxyRes.headers).forEach(([k, v]) => { try { if (v !== undefined) res.setHeader(k, v); } catch(e){} });
      proxyRes.pipe(res);
    });
    proxyReq.on('error', err => {
      console.error('❌ Erro no proxy multipart /api/noticias:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar upload' });
    });
    req.pipe(proxyReq);
  } catch (error) {
    console.error('❌ Erro geral /api/noticias POST proxy:', error.message);
    res.status(500).json({ error: 'Erro interno no proxy', message: error.message });
  }
});

// Proxy para obter notícia por ID - GET /api/noticias/:id
app.get('/api/noticias/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias/${req.params.id}`;
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy GET /api/noticias/:id:', error.message);
    res.status(502).json({ error: 'Erro ao obter notícia', message: error.message });
  }
});

// Proxy para atualizar notícia - PUT /api/noticias/:id
app.put('/api/noticias/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy PUT /api/noticias/:id:', error.message);
    res.status(502).json({ error: 'Erro ao atualizar notícia', message: error.message });
  }
});

// Proxy para deletar notícia - DELETE /api/noticias/:id
app.delete('/api/noticias/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/noticias/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, { method: 'DELETE' });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy DELETE /api/noticias/:id:', error.message);
    res.status(502).json({ error: 'Erro ao deletar notícia', message: error.message });
  }
});

// Proxy para criar publicação com upload (POST multipart)
app.post('/api/publicacoes', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/publicacoes`;
  const contentType = req.headers['content-type'] || '';
  try {
    // Se for JSON, encaminha via fetch
    if (contentType.includes('application/json')) {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      });
      const text = await response.text();
      res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
      return;
    }
    // Caso contrário trata como multipart (streaming)
    const target = new URL(targetUrl);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');
    const headers = { ...req.headers, host: target.host };
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
        try { if (typeof v !== 'undefined') res.setHeader(k, v); } catch(e){}
      });
      proxyRes.pipe(res);
    });
    proxyReq.on('error', err => {
      console.error('❌ Erro no proxy multipart /api/publicacoes:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar upload' });
    });
    req.pipe(proxyReq);
  } catch (error) {
    console.error('❌ Erro geral /api/publicacoes proxy:', error.message);
    res.status(500).json({ error: 'Erro interno no proxy', message: error.message });
  }
});

// Proxy atualizar publicação - PUT /api/publicacoes/:id
app.put('/api/publicacoes/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/publicacoes/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy PUT /api/publicacoes/:id:', error.message);
    res.status(502).json({ error: 'Erro ao atualizar publicação', message: error.message });
  }
});

// Proxy deletar publicação - DELETE /api/publicacoes/:id
app.delete('/api/publicacoes/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/publicacoes/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, { method: 'DELETE' });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy DELETE /api/publicacoes/:id:', error.message);
    res.status(502).json({ error: 'Erro ao deletar publicação', message: error.message });
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

// Proxy para criar oportunidade (JSON ou multipart) - POST
app.post('/api/oportunidades', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/oportunidades`;
  const contentType = req.headers['content-type'] || '';
  try {
    if (contentType.includes('application/json')) {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      });
      const text = await response.text();
      res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
      return;
    }
    const target = new URL(targetUrl);
    const isHttps = target.protocol === 'https:';
    const httpMod = isHttps ? require('https') : require('http');
    const headers = { ...req.headers, host: target.host };
    const options = { protocol: target.protocol, hostname: target.hostname, port: target.port || (isHttps ? 443 : 80), path: target.pathname + target.search, method: 'POST', headers };
    const proxyReq = httpMod.request(options, proxyRes => {
      res.status(proxyRes.statusCode || 500);
      Object.entries(proxyRes.headers).forEach(([k,v]) => { try { if (v !== undefined) res.setHeader(k,v); } catch(e){} });
      proxyRes.pipe(res);
    });
    proxyReq.on('error', err => {
      console.error('❌ Erro no proxy POST /api/oportunidades:', err.message);
      res.status(502).json({ error: 'Falha ao encaminhar oportunidade' });
    });
    req.pipe(proxyReq);
  } catch (error) {
    console.error('❌ Erro geral /api/oportunidades POST proxy:', error.message);
    res.status(500).json({ error: 'Erro interno no proxy', message: error.message });
  }
});

// Proxy para atualizar oportunidade - PUT
app.put('/api/oportunidades/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/oportunidades/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy PUT /api/oportunidades/:id:', error.message);
    res.status(502).json({ error: 'Erro ao atualizar oportunidade', message: error.message });
  }
});

// Proxy para deletar oportunidade - DELETE
app.delete('/api/oportunidades/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/oportunidades/${req.params.id}`;
  try {
    const response = await fetch(targetUrl, { method: 'DELETE' });
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy DELETE /api/oportunidades/:id:', error.message);
    res.status(502).json({ error: 'Erro ao deletar oportunidade', message: error.message });
  }
});

// Proxy obter oportunidade por ID - GET /api/oportunidades/:id
app.get('/api/oportunidades/:id', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/oportunidades/${req.params.id}`;
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(text);
  } catch (error) {
    console.error('❌ Erro no proxy GET /api/oportunidades/:id:', error.message);
    res.status(502).json({ error: 'Erro ao obter oportunidade', message: error.message });
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

// Proxy para autenticação: POST /api/auth/login (JSON)
app.post('/api/auth/login', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/auth/login`;
  const start = Date.now();
  const debug = process.env.DEBUG_AUTH === '1';
  const payloadPreview = (() => {
    try { return JSON.stringify({ mail: (req.body||{}).mail }); } catch { return '{}'; }
  })();
  if (debug) {
    console.log(`🔐 [AUTH-PROXY] -> POST ${targetUrl} payload=${payloadPreview}`);
  }
  const controller = new AbortController();
  const timeoutMs = Number(process.env.AUTH_PROXY_TIMEOUT_MS || 8000);
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const contentType = response.headers.get('content-type') || 'application/json';
    const text = await response.text();
    if (debug) {
      console.log(`🔐 [AUTH-PROXY] <- ${response.status} (${Date.now()-start}ms)`);
    }
    res.status(response.status).set('Content-Type', contentType).send(text);
  } catch (error) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    const isAbort = error.name === 'AbortError';
    console.error(`❌ Erro no proxy /api/auth/login (${elapsed}ms):`, error.message);
    res.status(502).json({ error: 'API não disponível', message: isAbort ? 'timeout' : error.message, elapsed });
  }
});

// Proxy para envio de contato: POST /api/contatos (JSON)
app.post('/api/contatos', async (req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/contatos`;
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const contentType = response.headers.get('content-type') || 'application/json';
    const text = await response.text();
    res.status(response.status).set('Content-Type', contentType).send(text);
  } catch (error) {
    console.error('❌ Erro no proxy /api/contatos:', error.message);
    res.status(502).json({ error: 'API não disponível', message: error.message });
  }
});

// Proxy para health do contato: GET /api/contatos/health
app.get('/api/contatos/health', async (_req, res) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://server:3013';
  const targetUrl = `${API_BASE_URL}/api/contatos/health`;
  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type') || 'application/json';
    const text = await response.text();
    res.status(response.status).set('Content-Type', contentType).send(text);
  } catch (error) {
    console.error('❌ Erro no proxy GET /api/contatos/health:', error.message);
    res.status(502).json({ error: 'API não disponível', message: error.message });
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