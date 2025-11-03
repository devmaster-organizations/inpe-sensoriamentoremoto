const pool = require('./db');

// Criar uma nova oportunidade
async function createOportunidade(req, res) {
  const { titulo, descricao, validade, exibir } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO oportunidades (titulo, descricao, validade, exibir)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descricao, validade, exibir]
    );

    const oportunidade = result.rows[0];
    res.status(201).json({
      message: 'Oportunidade criada com sucesso!',
      oportunidade
    });
  } catch (error) {
    console.error('Erro ao criar oportunidade:', error);
    res.status(500).json({ error: 'Erro ao criar oportunidade' });
  }
}

// Obter todas as oportunidades
async function getAllOportunidades(req, res) {
  try {
    const result = await pool.query('SELECT * FROM oportunidades WHERE exibir = true ORDER BY idoportunidade DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    res.status(500).json({ error: 'Erro ao buscar oportunidades' });
  }
}

// Atualizar uma oportunidade existente
async function updateOportunidade(req,res) {
  const { id } = req.params;
  const { titulo, descricao, validade, exibir } = req.body;

  try {
    const result = await pool.query(
      `UPDATE oportunidades
       SET titulo = $1, descricao = $2, validade = $3, exibir = $4
       WHERE idoportunidade = $5
       RETURNING *`,
      [titulo, descricao, validade, exibir, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidade não encontrada para atualização' });
    }

    res.status(200).json({
      message: 'Oportunidade atualizada com sucesso!',
      oportunidade: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar oportunidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar oportunidade' });
  }
}

// Deletar uma oportunidade
async function deleteOportunidade(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM oportunidades WHERE idoportunidade = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidade não encontrada para exclusão' });
    }

    res.status(200).json({ message: 'Oportunidade deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar oportunidade:', error);
    res.status(500).json({ error: 'Erro ao deletar oportunidade' });
  }
}

module.exports = {
  createOportunidade,
  getAllOportunidades,
  updateOportunidade,
  deleteOportunidade
};
