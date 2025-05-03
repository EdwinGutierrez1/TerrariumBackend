const express = require('express'); //Importamos Express para poder usar su router
const router = express.Router(); //Creamos una instancia del router
const brigadistaController = require('../controllers/brigadista.controller'); // Importamos el controlador que contiene la lógica para las rutas de brigadista
const authMiddleware = require('../middlewares/auth.middleware'); // Middleware para verificar token

// Ruta GET para obtener información del brigadista autenticado
router.get('/info', authMiddleware, brigadistaController.getInfoBrigadista);

// Ruta POST para actualizar el estado del tutorial
router.post('/tutorial', authMiddleware, brigadistaController.updateTutorialCompletado);

//Exportamos el router para que pueda ser usado por el archivo principal de rutas
module.exports = router;
