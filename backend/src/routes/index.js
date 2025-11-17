const express = require("express");
const router = express.Router();

const publicacao = require("./publicacao.routes");
const noticia = require("./noticia.routes");
const oportunidade = require("./oportunidade.routes");
const vaga = require("./vaga.routes");

router.use('/publicacoes', publicacao);
router.use('/noticias', noticia);
router.use('/oportunidades', oportunidade);
router.use('/vagas', vaga);

module.exports = router;
