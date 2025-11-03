const pool = require('./db');

// Criar uma nova notícia
async function createNoticia(req, res) {
  const { titulo, link, postagem, exibir } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO noticias (titulo, link, postagem, exibir, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, link, postagem, exibir, image]
    );

    const noticia = result.rows[0];
    res.status(201).json({
      message: 'Notícia criada com sucesso!',
      noticia
    });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    res.status(500).json({ error: 'Erro ao criar notícia' });
  }
}

// Obter todas as notícias
async function getAllNoticias(req, res) {
  try {
    const result = await pool.query('SELECT * FROM noticias WHERE exibir = TRUE ORDER BY idnoticia DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
};

// Atualizar uma notícia existente
async function updateNoticia(req, res) {
  const { id } = req.params;
  const { titulo, link, postagem, exibir } = req.body;

  try {
    const result = await pool.query(
      `UPDATE noticias
       SET titulo = $1, link = $2, postagem = $3, exibir = $4
       WHERE idnoticia = $5
       RETURNING *`,
      [titulo, link, postagem, exibir, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada para atualização' });
    }

    res.status(200).json({
      message: 'Notícia atualizada com sucesso!',
      noticia: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    res.status(500).json({ error: 'Erro ao atualizar notícia' });
  }
}

// Deletar uma notícia
async function deleteNoticia(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM noticias WHERE idnoticia = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada para exclusão' });
    }

    res.status(200).json({ message: 'Notícia deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
    res.status(500).json({ error: 'Erro ao deletar notícia' });
  }
}

module.exports = {
  createNoticia,
  getAllNoticias,
  updateNoticia,
  deleteNoticia
};
