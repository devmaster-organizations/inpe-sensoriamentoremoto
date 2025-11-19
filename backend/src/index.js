// Importa o framework Express para criar e gerenciar o servidor web
const express = require("express");
const rotas = require("./routes");
const path = require('path');
const dotenv = require("dotenv");

// Carrega as variáveis de ambiente definidas no arquivo .env.dev
dotenv.config({ path: '.env.dev' });

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para permitir o envio de dados em formato JSON no corpo das requisições
app.use(express.json());

// Lê a variável PORT definida no arquivo .env
const port = process.env.PORT;

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});

// Servir imagens estáticas da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usando as rotas
app.use('/api', rotas);

// Middleware para rotas não encontradas
app.use(function(_req, res){
  res.status(404).json({ error: "Rota não encontrada"});
});

