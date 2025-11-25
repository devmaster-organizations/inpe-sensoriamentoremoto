const nodemailer = require('nodemailer');
const os = require('os');

// Cria (lazy) um transporter somente se variáveis de SMTP existirem
function buildTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null; // Sem configuração de SMTP -> modo log
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

// POST /api/contatos
// Espera JSON: { nome, email, assunto, mensagem }
async function enviarContato(req, res) {
  const { nome, email, assunto, mensagem } = req.body || {};

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, mensagem.' });
  }

  const toAddress = process.env.CONTACT_TO || process.env.SMTP_USER; // Destinatário padrão
  const transporter = buildTransporter();

  const mailData = {
    from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
    to: toAddress,
    subject: assunto ? `[Contato] ${assunto}` : '[Contato] Mensagem do site',
    replyTo: email,
    text: `Nome: ${nome}\nEmail: ${email}\nAssunto: ${assunto || '-'}\n\nMensagem:\n${mensagem}\n\nOrigem: ${req.ip} (${os.hostname()})`,
    html: `<p><strong>Nome:</strong> ${nome}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Assunto:</strong> ${assunto || '-'}</p>
           <p><strong>Mensagem:</strong><br/>${(mensagem || '').replace(/\n/g,'<br/>')}</p>
           <hr/>
           <small>Origem: ${req.ip} (${os.hostname()})</small>`
  };

  // Modo fallback se não houver SMTP configurado
  if (!transporter) {
    console.warn('[Contato] SMTP não configurado. Payload será apenas logado.');
    console.info(mailData);
    return res.status(202).json({
      message: 'Mensagem recebida (modo log). SMTP não configurado.',
      logged: true
    });
  }

  try {
    await transporter.sendMail(mailData);
    return res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar email de contato:', err);
    return res.status(500).json({ error: 'Falha ao enviar mensagem.' });
  }
}

module.exports = { enviarContato };
