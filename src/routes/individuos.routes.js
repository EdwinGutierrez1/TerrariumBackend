// routes/individuos.routes.js
const express = require('express');
const router = express.Router();
const individuosController = require('../controllers/individuos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Ruta GET para obtener el siguiente ID disponible para individuos
router.get('/siguienteId', authMiddleware, individuosController.siguienteIdIndividuo);

module.exports = router;