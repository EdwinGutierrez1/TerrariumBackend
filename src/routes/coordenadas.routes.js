// src/routes/coordenadas.routes.js
const express = require('express');
const router = express.Router();
const coordenadasController = require('../controllers/coordenadas.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Ruta protegida que requiere autenticación
router.get('/subparcelas', verifyToken, coordenadasController.getCoordenadas);

module.exports = router;