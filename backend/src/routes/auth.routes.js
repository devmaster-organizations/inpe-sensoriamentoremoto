const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

// Login
router.post("/login", usuarioController.login);

module.exports = router;
