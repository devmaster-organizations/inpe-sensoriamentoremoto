const express = require('express');
const multer = require("multer");
const path = require('path');
const router = express.Router();
const vagaController = require('../controllers/vaga.controller');

// Configuração do multer para salvar imagens em /uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const allowed = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Formato de imagem inválido. Use PNG ou JPEG."));
      }
      cb(null, true);
    },
  });

// Rotas para o CRUD de vagas
// Aceita o campo de arquivo como 'imagem' (preferido) ou 'image' (alias) para evitar erros Multer "Unexpected field"
const uploadMiddleware = upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

router.post('/', uploadMiddleware, (req, _res, next) => {
  // Normaliza para req.file para manter o controller atual compatível
  if (!req.file && req.files) {
    req.file = (req.files.imagem && req.files.imagem[0]) || (req.files.image && req.files.image[0]);
  }
  next();
}, vagaController.createVaga);
router.get('/', vagaController.getAllVagas);
router.put('/:id', vagaController.updateVaga);
router.delete('/:id', vagaController.deleteVaga);

module.exports = router;
