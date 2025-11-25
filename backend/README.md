
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
```

Se qualquer credencial SMTP essencial estiver ausente, o backend apenas registra os dados da mensagem no console e retorna status 202.