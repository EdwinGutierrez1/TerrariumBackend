const express = require('express');
const router = express.Router();
const trayectoController = require('../controllers/trayectoController');
const authMiddleware = require('../middlewares/auth.middleware');

// Ruta para guardar un nuevo trayecto
router.post('/', authMiddleware, trayectoController.guardarTrayecto);
router.put('/:puntoId', authMiddleware, trayectoController.actualizarTrayecto);



module.exports = router;
