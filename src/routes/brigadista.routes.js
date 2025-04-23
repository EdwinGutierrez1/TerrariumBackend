const express = require('express');
const router = express.Router();
const brigadistaController = require('../controllers/brigadistaController');
const authMiddleware = require('../middlewares/authMiddleware'); // Asumiendo que tienes un middleware de autenticación

// Rutas protegidas que requieren autenticación
router.get('/info', authMiddleware, brigadistaController.getInfoBrigadista);
router.post('/tutorial', authMiddleware, brigadistaController.updateTutorialCompletado);

module.exports = router;