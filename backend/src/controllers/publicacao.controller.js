const pool = require('./db');

// Criar uma nova publicação
async function createPublicacao(req, res) {
  const { texto, ano, link, doi } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO publicacoes (texto, ano, link, doi) VALUES ($1, $2, $3, $4) RETURNING *',
      [texto, ano, link, doi]
    );
    
    const publicacao = result.rows[0];
    res.status(201).json({
      message: 'Publicação criada com sucesso!',
      publicacao
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar publicação' });
  }
}

// Obter todas as publicações
async function getAllPublicacoes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM publicacoes ORDER BY ano DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar publicações' });
  }
}

// Atualizar uma publicação existente
async function updatePublicacao(req, res) {
  const { id } = req.params;
  const { texto, ano, link, doi } = req.body;

  try {
    const result = await pool.query(
      'UPDATE publicacoes SET texto = $1, ano = $2, link = $3, doi = $4 WHERE idpublicacao = $5 RETURNING *',
      [texto, ano, link, doi, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicação não encontrada para atualização' });
    }

    const updatedPublicacao = result.rows[0];
    res.status(200).json({
      message: 'Publicação atualizada com sucesso!',
      publicacao: updatedPublicacao
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar publicação' });
  }
}

// Deletar uma publicação
async function deletePublicacao(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM publicacoes WHERE idpublicacao = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicação não encontrada para exclusão' });
    }

    res.status(200).json({ message: 'Publicação deletada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar publicação' });
  }
}

module.exports = {
  createPublicacao,
  getAllPublicacoes,
  updatePublicacao,
  deletePublicacao
};
