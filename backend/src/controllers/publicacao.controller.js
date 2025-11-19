const pool = require('./db');

// Criar uma nova publicação
async function createPublicacao(req, res) {
  const { texto, ano, link, doi } = req.body;
  // Aceita upload via multer (req.file) ou caminho vindo em JSON (req.body.filePath)
  const image = req.file
    ? `/uploads/${req.file.filename}`
    : (req.body && req.body.filePath ? req.body.filePath : null);
  
  try {
    const result = await pool.query(
      'INSERT INTO publicacoes (texto, ano, link, doi, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [texto, ano, link, doi, image]
    );
    
    const publicacao = result.rows[0];
    // Alias para compatibilidade com o frontend admin (usa filePath)
    publicacao.filePath = publicacao.image;
    res.status(201).json({
      message: 'Publicação criada com sucesso!',
      publicacao
    });
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    res.status(500).json({ error: 'Erro ao criar publicação' });
  }
}

// Obter todas as publicações
async function getAllPublicacoes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM publicacoes ORDER BY ano DESC');
    const rows = result.rows.map(r => ({ ...r, filePath: r.image }));
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar publicações' });
  }
}

// Obter uma publicação por ID
async function getPublicacaoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM publicacoes WHERE idpublicacao = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicação não encontrada' });
    }
    const row = result.rows[0];
    row.filePath = row.image;
    res.status(200).json(row);
  } catch (error) {
    console.error('Erro ao buscar publicação por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar publicação' });
  }
}

// Atualizar uma publicação existente
async function updatePublicacao(req, res) {
  const { id } = req.params;
  const { texto, ano, link, doi, filePath } = req.body;

  try {
    const result = await pool.query(
      'UPDATE publicacoes SET texto = $1, ano = $2, link = $3, doi = $4, image = COALESCE($5, image) WHERE idpublicacao = $6 RETURNING *',
      [texto, ano, link, doi, filePath || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicação não encontrada para atualização' });
    }

    const updatedPublicacao = result.rows[0];
    updatedPublicacao.filePath = updatedPublicacao.image;
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
  getPublicacaoById,
  updatePublicacao,
  deletePublicacao
};
