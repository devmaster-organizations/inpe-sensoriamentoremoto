#!/usr/bin/env node

/**
 * Script para iniciar o projeto em desenvolvimento local (sem Docker)
 * Uso: node dev-start.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, prefix, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

function checkNodeModules(dir, name) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log(colors.yellow, name, 'node_modules não encontrado, instalando dependências...');
    return false;
  }
  return true;
}

async function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    log(colors.blue, name, 'Executando npm install...');
    const npm = spawn('npm', ['install'], { 
      cwd: dir, 
      stdio: 'inherit',
      shell: true 
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        log(colors.green, name, 'Dependências instaladas com sucesso!');
        resolve();
      } else {
        log(colors.red, name, `Erro ao instalar dependências (código ${code})`);
        reject(new Error(`npm install falhou em ${name}`));
      }
    });
  });
}

async function startService(dir, name, envFile, command = 'dev') {
  return new Promise((resolve) => {
    // Copia .env.dev para .env se não existir
    const envPath = path.join(dir, '.env');
    const envDevPath = path.join(dir, envFile);
    
    if (!fs.existsSync(envPath) && fs.existsSync(envDevPath)) {
      fs.copyFileSync(envDevPath, envPath);
      log(colors.cyan, name, `Copiado ${envFile} para .env`);
    }

    log(colors.green, name, `Iniciando serviço...`);
    
    const service = spawn('npm', ['run', command], { 
      cwd: dir,
      stdio: 'inherit',
      shell: true
    });
    
    service.on('close', (code) => {
      log(colors.red, name, `Serviço encerrado com código ${code}`);
    });
    
    // Não resolve imediatamente - serviços devem rodar continuamente
  });
}

async function main() {
  const frontendDir = path.join(__dirname, 'frontend');
  const backendDir = path.join(__dirname, 'backend');
  
  console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                  🚀 AgriRS Lab - Dev Setup                  ║
║                                                              ║
║  Iniciando projeto em modo desenvolvimento local            ║
║  (sem Docker)                                               ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // Verificar e instalar dependências do backend
    if (!checkNodeModules(backendDir, 'BACKEND')) {
      await installDependencies(backendDir, 'BACKEND');
    }
    
    // Verificar e instalar dependências do frontend  
    if (!checkNodeModules(frontendDir, 'FRONTEND')) {
      await installDependencies(frontendDir, 'FRONTEND');
    }

    log(colors.green, 'SETUP', 'Dependências verificadas!');
    
    console.log(`
${colors.yellow}📋 Pré-requisitos para desenvolvimento local:${colors.reset}
  1. PostgreSQL rodando em localhost:5432
  2. Banco 'abp' criado com usuário 'docker'/'password'
  3. Schema inicializado (backend/src/controllers/db.sql)

${colors.cyan}🌐 URLs de acesso:${colors.reset}
  Frontend: http://localhost:3021
  Backend:  http://localhost:3013

${colors.magenta}💡 Para parar os serviços: Ctrl+C${colors.reset}
`);

    // Esperar um pouco antes de iniciar
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Iniciar backend em processo separado
    log(colors.blue, 'BACKEND', 'Iniciando backend...');
    startService(backendDir, 'BACKEND', '.env.dev', 'dev');
    
    // Aguardar um pouco antes de iniciar o frontend
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Iniciar frontend
    log(colors.blue, 'FRONTEND', 'Iniciando frontend...');
    await startService(frontendDir, 'FRONTEND', '.env.dev', 'dev');
    
  } catch (error) {
    log(colors.red, 'ERRO', error.message);
    process.exit(1);
  }
}

// Tratamento de sinal para encerramento gracioso
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}🛑 Encerrando serviços...${colors.reset}`);
  process.exit(0);
});

main().catch(error => {
  log(colors.red, 'ERRO', error.message);
  process.exit(1);
});