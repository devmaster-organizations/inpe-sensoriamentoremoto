const express = require("express");
const router = express.Router();
const oportunidadeController = require("../controllers/oportunidade.controller");

// Rotas para o CRUD de oportunidades
router.post("/", oportunidadeController.createOportunidade);
router.get("/", oportunidadeController.getAllOportunidades);
router.put("/:id", oportunidadeController.updateOportunidade);
router.delete("/:id", oportunidadeController.deleteOportunidade);

module.exports = router;
