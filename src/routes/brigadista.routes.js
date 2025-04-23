const express = require('express');
const router = express.Router();
const brigadistaController = require('../controllers/brigadista.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // Asumiendo que tienes un middleware de autenticación
const verifyToken = require('../middlewares/auth.middleware');

// Rutas protegidas que requieren autenticación
router.get('/info', verifyToken, brigadistaController.getInfoBrigadista);
router.post('/tutorial', authMiddleware, brigadistaController.updateTutorialCompletado);

module.exports = router;