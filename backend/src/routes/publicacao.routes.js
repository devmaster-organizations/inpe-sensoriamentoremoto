const express = require('express');
const router = express.Router();
const publicacaoController = require('../controllers/publicacao.controller');

// Rotas para o CRUD de publicações
router.post('/', publicacaoController.createPublicacao);
router.get('/', publicacaoController.getAllPublicacoes);
router.put('/:id', publicacaoController.updatePublicacao);
router.delete('/:id', publicacaoController.deletePublicacao);

module.exports = router;
