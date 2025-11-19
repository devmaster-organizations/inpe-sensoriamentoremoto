const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.dev' });

async function main(){
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
  });
  const mail = process.argv[2];
  const senha = process.argv[3];
  if(!mail || !senha){
    console.error('uso: node scripts/set_user.js <mail> <senha>');
    process.exit(1);
  }
  try{
    await pool.query(`CREATE TABLE IF NOT EXISTS usuarios (
      idusuario SERIAL PRIMARY KEY,
      mail VARCHAR(100) NOT NULL,
      senha VARCHAR(100) NOT NULL
    )`);
    const sel = await pool.query('SELECT idusuario FROM usuarios WHERE mail=$1 LIMIT 1', [mail.toLowerCase()]);
    if(sel.rows.length){
      const id = sel.rows[0].idusuario;
      await pool.query('UPDATE usuarios SET senha=$1 WHERE idusuario=$2', [senha, id]);
      console.log('updated', { id, mail });
    } else {
      const ins = await pool.query('INSERT INTO usuarios (mail, senha) VALUES ($1,$2) RETURNING idusuario', [mail.toLowerCase(), senha]);
      console.log('created', { id: ins.rows[0].idusuario, mail });
    }
  } catch(err){
    console.error('ERR', err);
    process.exit(2);
  } finally {
    process.exit(0);
  }
}

main();
