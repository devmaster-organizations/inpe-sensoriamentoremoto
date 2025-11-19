const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change';
const TOKEN_EXP = '2h';

// Util: normaliza email
function normMail(mail){
  return (mail||'').trim().toLowerCase();
}

// Login: POST /api/auth/login { mail, senha }
async function login(req, res){
  const { mail, senha } = req.body || {};
  if(!mail || !senha){
    return res.status(400).json({ error: 'Informe mail e senha' });
  }
  try {
    const nm = normMail(mail);
    const result = await pool.query('SELECT * FROM usuarios WHERE mail = $1 LIMIT 1', [nm]);
    if(result.rows.length === 0){
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const user = result.rows[0];
    // Se senha armazenada não está hasheada (ex inicial "123456"), aceita texto puro ou hash
    const stored = user.senha;
    let ok = false;
    if(stored.startsWith('$2a$') || stored.startsWith('$2b$')){
      ok = await bcrypt.compare(senha, stored);
    } else {
      ok = senha === stored; // fallback para senha de seed simples
    }
    if(!ok){
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ sub: user.idusuario, mail: user.mail }, JWT_SECRET, { expiresIn: TOKEN_EXP });
    return res.json({ token, usuario: { id: user.idusuario, mail: user.mail } });
  } catch (err){
    console.error('Erro login:', err);
    return res.status(500).json({ error: 'Erro interno no login' });
  }
}

// Registro opcional (não usado diretamente, mas útil para extensão)
async function register(req, res){
  const { mail, senha } = req.body || {};
  if(!mail || !senha){
    return res.status(400).json({ error: 'Informe mail e senha' });
  }
  try {
    const nm = normMail(mail);
    const exists = await pool.query('SELECT 1 FROM usuarios WHERE mail=$1 LIMIT 1', [nm]);
    if(exists.rows.length){
      return res.status(409).json({ error: 'Usuário já existe' });
    }
    const hash = await bcrypt.hash(senha, 10);
    const ins = await pool.query('INSERT INTO usuarios (mail, senha) VALUES ($1, $2) RETURNING idusuario, mail', [nm, hash]);
    const u = ins.rows[0];
    return res.status(201).json({ usuario: { id: u.idusuario, mail: u.mail } });
  } catch (err){
    console.error('Erro cadastro:', err);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

// Cria ou atualiza usuário (apenas dev) – idempotente por e-mail
async function ensure(req, res){
  if (process.env.NODE_ENV === 'production'){
    return res.status(403).json({ error: 'Operação não permitida em produção' });
  }
  const { mail, senha } = req.body || {};
  if(!mail || !senha){
    return res.status(400).json({ error: 'Informe mail e senha' });
  }
  try {
    const nm = normMail(mail);
    const hash = await bcrypt.hash(senha, 10);
    const found = await pool.query('SELECT idusuario FROM usuarios WHERE mail=$1 LIMIT 1', [nm]);
    if(found.rows.length){
      const id = found.rows[0].idusuario;
      const up = await pool.query('UPDATE usuarios SET senha=$1 WHERE idusuario=$2 RETURNING idusuario, mail', [hash, id]);
      const u = up.rows[0];
      return res.json({ usuario: { id: u.idusuario, mail: u.mail }, updated: true });
    } else {
      const ins = await pool.query('INSERT INTO usuarios (mail, senha) VALUES ($1,$2) RETURNING idusuario, mail', [nm, hash]);
      const u = ins.rows[0];
      return res.status(201).json({ usuario: { id: u.idusuario, mail: u.mail }, created: true });
    }
  } catch(err){
    console.error('Erro ensure usuario:', err);
    return res.status(500).json({ error: 'Erro ao criar/atualizar usuário' });
  }
}

module.exports = { login, register, ensure };
