const express = require('express');
const router = express.Router();
const { enviarContato } = require('../controllers/contato.controller');

// Envia email do formulário de contato
router.post('/', enviarContato);

module.exports = router;
