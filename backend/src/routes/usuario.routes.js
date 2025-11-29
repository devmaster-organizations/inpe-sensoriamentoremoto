const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Registro opcional
router.post('/', usuarioController.register);

// Dev-only: cria/atualiza usuário por e-mail
router.post('/ensure', usuarioController.ensure);

module.exports = router;
