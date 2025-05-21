//LISTO
//Rutas de subparcelas
const express = require('express'); //Para la definición de rutas
const router = express.Router(); // Instanciamos el router de Express
const subparcelaController = require('../controllers/subparcela.controller'); // Importamos el controlador de subparcelas 
const authMiddleware = require('../middlewares/auth.middleware'); // Importamos el middleware de autenticación para proteger las rutas

//Ruta POST para sincronizar datos de subparcelas
router.post('/sincronizar', authMiddleware, subparcelaController.sincronizarSubparcelas);
router.get('/arboles/:conglomeradoId/:nombreSubparcela', authMiddleware, subparcelaController.getArbolesSubparcela); // Ruta GET para obtener árboles de una subparcela específica
router.get('/caracteristicas/:conglomeradoId/:nombreSubparcela', authMiddleware, subparcelaController.getCaracteristicasSubparcela); // Ruta GET para obtener características de una subparcela específica
router.get('/idsSubparcelas/:conglomeradoId', authMiddleware, subparcelaController.getIdsSubparcelasByConglomerado); // Ruta GET para obtener IDs de subparcelas por ID de conglomerado
router.get('/id', authMiddleware, subparcelaController.getSubparcelaId); // Ruta GET para obtener el ID de una subparcela por nombre y conglomerado

module.exports = router; // Exportamos el router para ser utilizado en app.js