const express = require("express");
const router = express.Router();

const publicacao = require("./publicacao.routes");
const noticia = require("./noticia.routes");
const oportunidade = require("./oportunidade.routes");

router.use('/publicacoes', publicacao);
router.use('/noticias', noticia);
router.use('/oportunidades', oportunidade);

module.exports = router;
