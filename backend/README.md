
### Execução Local

1. Criar o banco `abp` no pgAdmin.
2. Copiar os comandos de `/server/controllers/db.sql` para criar as tabelas no banco `abp`. 

### Requests HTTP
O arquivo `http/*.http` contém exemplos requisições para testar as rotas HTTP.
É necessário instalar a extensão REST Client (VSCode) e para executar basta abrir o arquivo `noticias.http` e clicar em `Send Request`.

### Envio de Email (Formulário de Contato)

Endpoint: `POST /api/contatos`

Body (JSON):
```
{
	"nome": "Fulano",
	"email": "fulano@exemplo.com",
	"assunto": "Dúvida",
	"mensagem": "Texto da mensagem"
}
```

Campos obrigatórios: `nome`, `email`, `mensagem`.

Resposta (sucesso):
```
{ "message": "Mensagem enviada com sucesso!" }
```
Modo log (quando SMTP não configurado):
```
{ "message": "Mensagem recebida (modo log). SMTP não configurado.", "logged": true }
```

Configure as variáveis de ambiente (exemplo em `.env.dev`):
```
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@seuprovedor.com
SMTP_PASS=senha_aqui
CONTACT_TO=destinatario@seusite.com   # opcional (cai no SMTP_USER se ausente)
CONTACT_FROM=site@seusite.com         # opcional (cai no SMTP_USER se ausente)
CONTACT_DEV_MODE=1                    # opcional: se definido, sobrescreve NODE_ENV (1=apenas loga; 0=envia)
```

Regras de envio:
- Se `CONTACT_DEV_MODE` estiver definido, ele tem prioridade: `1` (não envia, só loga) ou `0` (envia normalmente).
- Se `CONTACT_DEV_MODE` não estiver definido, usa `NODE_ENV`: somente envia em `NODE_ENV=production`.
- Se credenciais SMTP estiverem ausentes, sempre faz log (202).