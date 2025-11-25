const { Pool } = require("pg");
const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
dotenv.config({ path: envFile });

const config = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT) || 5432
};

if (process.env.POSTGRES_SSL === 'true') {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do Postgres:', err.message);
});

module.exports = pool;
