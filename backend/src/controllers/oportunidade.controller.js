const pool = require('./db');

// Criar uma nova oportunidade
async function createOportunidade(req, res) {
  const { titulo, descricao, validade, exibir, imagemUrl } = req.body;
  // Prioriza imagemUrl (link externo) sobre upload de arquivo
  // Valida se imagemUrl não é string vazia
  const image = (imagemUrl && typeof imagemUrl === 'string' && imagemUrl.trim() !== '') 
    ? imagemUrl.trim() 
    : (req.file ? `/uploads/${req.file.filename}` : null);

  console.log('📝 Criando oportunidade:', { titulo, imagemUrl, imageResult: image, body: req.body });

  try {
    const result = await pool.query(
      `INSERT INTO oportunidades (titulo, descricao, validade, exibir, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, descricao, validade, exibir, image]
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
    // Se admin=true vier como query param, retorna todas (inclusive não exibidas)
    const isAdmin = req.query.admin === 'true';
    const query = isAdmin 
      ? 'SELECT * FROM oportunidades ORDER BY idoportunidade DESC'
      : 'SELECT * FROM oportunidades WHERE exibir = true ORDER BY idoportunidade DESC';
    
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    res.status(500).json({ error: 'Erro ao buscar oportunidades' });
  }
}

// Obter oportunidade por ID
async function getOportunidadeById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM oportunidades WHERE idoportunidade = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidade não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar oportunidade por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar oportunidade' });
  }
}

// Atualizar uma oportunidade existente
async function updateOportunidade(req,res) {
  const { id } = req.params;
  const { titulo, descricao, validade, exibir, imagemUrl } = req.body;
  // Se imagemUrl vier, usa; senão mantém a imagem atual (não sobrescreve com null)
  // Valida se imagemUrl não é string vazia
  const image = (imagemUrl !== undefined && typeof imagemUrl === 'string' && imagemUrl.trim() !== '') 
    ? imagemUrl.trim() 
    : undefined;

  console.log('✏️ Atualizando oportunidade:', { id, imagemUrl, imageResult: image, body: req.body });

  try {
    // Monta query dinâmica para não sobrescrever imagem se não vier no body
    let query = `UPDATE oportunidades SET titulo = $1, descricao = $2, validade = $3, exibir = $4`;
    let params = [titulo, descricao, validade, exibir];
    if (image !== undefined) {
      query += `, image = $5 WHERE idoportunidade = $6 RETURNING *`;
      params.push(image, id);
    } else {
      query += ` WHERE idoportunidade = $5 RETURNING *`;
      params.push(id);
    }
    const result = await pool.query(query, params);

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
  getOportunidadeById,
  updateOportunidade,
  deleteOportunidade
};
