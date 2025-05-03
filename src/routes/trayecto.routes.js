// Rutas de Trayectos

const express = require('express'); // Importamos Express
const router = express.Router(); // Creamos un enrutador de Express
const trayectoController = require('../controllers/trayecto.controller'); // Se importa el controlador de trayectos 
const authMiddleware = require('../middlewares/auth.middleware'); // Se importa el middleware de autenticación para proteger las rutas

// Ruta POST para crear un nuevo trayecto
router.post('/', authMiddleware, trayectoController.guardarTrayecto);


//Ruta PUT para actualizar un trayecto existente
//El parámetro puntoId identifica el punto de referencia asociado al trayecto
router.put('/:puntoId', authMiddleware, trayectoController.actualizarTrayecto);

//Ruta GET para obtener el siguiente ID disponible para trayectos
router.get('/siguienteId', authMiddleware, trayectoController.obtenerIdTrayecto);

//Se eporta el enrutador
module.exports = router;