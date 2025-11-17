const pool = require('./db');

// Criar uma nova vaga
async function createVaga(req, res) {
  const { titulo, link, postagem, exibir } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  
  try {
    const result = await pool.query(
      `INSERT INTO vagas (titulo, link, postagem, exibir, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, link, postagem, exibir, image]
    );

    const vaga = result.rows[0];
    res.status(201).json({
      message: 'Vaga criada com sucesso!',
      vaga
    });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
}

// Obter todas as vagas
async function getAllVagas(req, res) {
  try {
    const result = await pool.query('SELECT * FROM vagas WHERE exibir = TRUE ORDER BY idvaga DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
};

// Atualizar uma vaga existente
async function updateVaga(req, res) {
  const { id } = req.params;
  const { titulo, link, postagem, exibir } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vagas
       SET titulo = $1, link = $2, postagem = $3, exibir = $4
       WHERE idvaga = $5
       RETURNING *`,
      [titulo, link, postagem, exibir, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada para atualização' });
    }

    res.status(200).json({
      message: 'Vaga atualizada com sucesso!',
      vaga: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
}

// Deletar uma vaga
async function deleteVaga(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM vagas WHERE idvaga = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada para exclusão' });
    }

    res.status(200).json({ message: 'Vaga deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    res.status(500).json({ error: 'Erro ao deletar vaga' });
  }
}

module.exports = {
  createVaga,
  getAllVagas,
  updateVaga,
  deleteVaga
};
