const express = require("express");
const router = express.Router();

const publicacao = require("./publicacao.routes");
const noticia = require("./noticia.routes");
const oportunidade = require("./oportunidade.routes");
const vaga = require("./vaga.routes");
const auth = require("./auth.routes");
const usuario = require("./usuario.routes");

router.use('/publicacoes', publicacao);
router.use('/noticias', noticia);
router.use('/oportunidades', oportunidade);
router.use('/vagas', vaga);
router.use("/auth", auth);
router.use("/usuarios", usuario);

module.exports = router;
