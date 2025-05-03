const express = require('express'); //para definir rutas
const router = express.Router(); // Creamos una instancia del router

// Importamos el controlador que maneja la lógica de coordenadas
const coordenadasController = require('../controllers/coordenadas.controller');

// Middleware de autenticación para proteger las rutas
const verifyToken = require('../middlewares/auth.middleware');

// Ruta para obtener las coordenadas de las subparcelas
router.get('/subparcelas', verifyToken, coordenadasController.getCoordenadasSubparcelas);

// Ruta para obtener el centro poblado de la brigada
router.get('/centro-poblado', verifyToken, coordenadasController.getCentroPoblado);

//  Exportamos el router para ser usado en la configuración principal de rutas (app.js)
module.exports = router;
