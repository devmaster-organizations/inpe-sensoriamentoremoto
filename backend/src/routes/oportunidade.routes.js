const express = require("express");
const router = express.Router();
const oportunidadeController = require("../controllers/oportunidade.controller");
const authGuard = require('../util/authGuard');

// Rotas para o CRUD de oportunidades
// Public site must remain open: remove authGuard from mutation routes.
router.post("/", oportunidadeController.createOportunidade);
router.get("/", oportunidadeController.getAllOportunidades);
router.get("/:id", oportunidadeController.getOportunidadeById);
router.put("/:id", oportunidadeController.updateOportunidade);
router.delete("/:id", oportunidadeController.deleteOportunidade);

module.exports = router;
