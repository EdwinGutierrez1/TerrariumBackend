const express = require('express');
const router = express.Router();
const trayectoController = require('../controllers/trayecto.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Ruta para guardar un nuevo trayecto
router.post('/', authMiddleware, trayectoController.guardarTrayecto);
router.put('/:puntoId', authMiddleware, trayectoController.actualizarTrayecto);
router.get('/siguienteId', authMiddleware, trayectoController.obtenerIdTrayecto);


module.exports = router;
