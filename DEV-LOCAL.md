# 🚀 Desenvolvimento Local (sem Docker)

Este guia permite rodar o projeto localmente sem Docker para facilitar o desenvolvimento da equipe.

## Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **PostgreSQL** rodando localmente
3. **Git** para clonar o repositório

## Setup Inicial

### 1. Instalar PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Baixe e instale do site oficial: https://www.postgresql.org/download/windows/

### 2. Configurar Banco de Dados

```bash
# Acessar PostgreSQL como superuser
sudo -u postgres psql

# Criar usuário e banco (dentro do psql)
CREATE USER docker WITH PASSWORD 'password';
CREATE DATABASE abp OWNER docker;
GRANT ALL PRIVILEGES ON DATABASE abp TO docker;
\q
```

### 3. Inicializar Schema

```bash
# Executar script SQL de inicialização
psql -h localhost -U docker -d abp -f backend/src/controllers/db.sql
```

## Como Executar

### Opção 1: Script Automático (Recomendado)

```bash
# No diretório raiz do projeto
node dev-start.js
```

Este script:
- ✅ Instala dependências automaticamente
- ✅ Configura variáveis de ambiente
- ✅ Inicia backend e frontend juntos
- ✅ Mostra logs coloridos para cada serviço

### Opção 2: Manual (para debugging)

**Terminal 1 - Backend:**
```bash
cd backend
cp .env.dev .env  # copia configuração de desenvolvimento
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
cp .env.dev .env  # copia configuração de desenvolvimento
npm install
npm run dev
```

## URLs de Acesso

- **Frontend**: http://localhost:3021
- **Backend API**: http://localhost:3013
- **PostgreSQL**: localhost:5432

## Configuração de Ambiente

### Frontend (.env.dev)
```env
PORT=3021
API_BASE_URL=http://localhost:3013
```

### Backend (.env.dev)
```env
PORT=3013
POSTGRES_HOST=localhost
POSTGRES_USER=docker
POSTGRES_PASSWORD=password
POSTGRES_DB=abp
POSTGRES_PORT=5432
```

## Desenvolvimento

### Estrutura
- `frontend/`: Interface web (SPA, CSS, JS)
- `backend/`: API Express + controllers

### Hot Reload
- Frontend: Nodemon recarrega ao salvar arquivos
- Backend: Nodemon reinicia o servidor automaticamente

### Debugging
- Backend logs aparecem no terminal 1
- Frontend logs aparecem no terminal 2
- Erros de banco checam se PostgreSQL está rodando

## Comandos Úteis

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Parar/iniciar PostgreSQL
sudo systemctl stop postgresql
sudo systemctl start postgresql

# Conectar ao banco para debug
psql -h localhost -U docker -d abp

# Ver logs do backend
cd backend && npm run dev

# Ver logs do frontend  
cd frontend && npm run dev
```

## Troubleshooting

### "ECONNREFUSED" no backend
- PostgreSQL não está rodando
- Credenciais incorretas no .env

### Frontend não carrega dados
- Backend não está rodando na porta 3013
- Verificar proxy em frontend/server.js

### "Module not found"
- Executar `npm install` nos diretórios backend/ e frontend/

## Vantagens do Desenvolvimento Local

- ⚡ **Mais rápido**: sem overhead do Docker
- 🔧 **Debugging fácil**: logs diretos no terminal
- 💾 **Menos recursos**: não usa virtualização
- 🔄 **Hot reload**: mudanças refletem instantaneamente