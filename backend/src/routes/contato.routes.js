const express = require('express');
const router = express.Router();
const { enviarContato, health } = require('../controllers/contato.controller');

// Envia email do formulário de contato
router.post('/', enviarContato);
router.get('/health', health);

module.exports = router;
