const express = require('express'); // Importamos Express
const router = express.Router(); // Creamos un enrutador de Express
const muestrasController = require('../controllers/muestras.controller'); // Se importa el controlador de muestras 
const authMiddleware = require('../middlewares/auth.middleware'); // Se importa el middleware de autenticación para proteger las rutas

router.get('/siguienteId', authMiddleware, muestrasController.ultimoIdMuestra); // Ruta GET para obtener el siguiente ID disponible para muestras

module.exports = router; // Se exporta el enrutador