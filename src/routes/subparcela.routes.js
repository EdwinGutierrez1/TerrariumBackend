//Rutas de subparcelas

const express = require('express'); // para la definición de rutas
const router = express.Router(); // Instanciamos el router de Express
const subparcelaController = require('../controllers/subparcela.controller'); // Importamos el controlador de subparcelas 
const authMiddleware = require('../middlewares/auth.middleware'); // Importamos el middleware de autenticación para proteger las rutas

//Ruta POST para sincronizar datos de subparcelas
router.post('/sincronizar', authMiddleware, subparcelaController.sincronizarSubparcelas);
router.get('/arboles/:conglomeradoId/:nombreSubparcela', authMiddleware, subparcelaController.getArbolesSubparcela); // Ruta para obtener árboles de una subparcela específica
router.get('/caracteristicas/:conglomeradoId/:nombreSubparcela', authMiddleware, subparcelaController.getCaracteristicasSubparcela); // Ruta para obtener características de una subparcela específica
router.get('/idsSubparcelas/:conglomeradoId', authMiddleware, subparcelaController.getIdsSubparcelasByConglomerado); // Ruta para obtener IDs de subparcelas por ID de conglomerado
router.get('/id', authMiddleware, subparcelaController.getSubparcelaId); // Ruta para obtener ID de subparcela por nombre y conglomerado

// Exportamos el router para ser utilizado en app.js
module.exports = router;