const express = require('express');
const router = express.Router();
const trayectoController = require('../controllers/trayectoController');
const authMiddleware = require('../middlewares/auth.middleware');

// Ruta para guardar un nuevo trayecto
router.post('/', authMiddleware, trayectoController.guardarTrayecto);

// Ruta para actualizar un trayecto existente
//router.put('/', authMiddleware, trayectoController.actualizarDatosTrayecto);

// Ruta para obtener un trayecto por ID
//router.get('/:id', authMiddleware, trayectoController.obtenerTrayecto);

module.exports = router;
