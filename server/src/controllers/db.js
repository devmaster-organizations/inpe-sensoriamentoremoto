const { Pool } = require("pg");
const dotenv = require("dotenv");
// Carrega  as variáveis de ambiente definidas no arquivo .env
dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT
});

module.exports = pool;
