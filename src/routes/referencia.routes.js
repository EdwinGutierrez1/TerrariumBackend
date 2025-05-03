// Rutas para la gestión de Puntos de Referencia

const express = require('express'); //Importamos Express para poder usar su router
const router = express.Router(); //Creamos una instancia del router
const referenciaController = require('../controllers/referencia.controller'); //Importamos el controlador de los puntos de referencia. 
const authMiddleware = require('../middlewares/auth.middleware'); //Importamos el middleware de autenticación.


 //ruta para obtener el siguiente ID disponible para un nuevo punto de referencia
router.get('/siguiente-id', authMiddleware, referenciaController.getSiguienteId);

//ruta para crear un nuevo punto de referencia
router.post('/', authMiddleware, referenciaController.insertarReferencia);

//ruta para actualizar un punto de referencia existente
router.put('/:id', authMiddleware, referenciaController.actualizarReferencia);

//ruta para eliminar un punto de referencia específico
router.delete('/:id', authMiddleware, referenciaController.eliminarReferencia);

//ruta para obtener todos los puntos de referencia asociados a un conglomerado
router.get('/conglomerado/:idConglomerado', referenciaController.getPuntosReferenciaByConglomerado);

//ruta para obtener un punto de referencia específico por su ID
router.get('/punto/:id', authMiddleware, referenciaController.obtenerReferenciaPorId);

//ruta para verificar la cantidad de puntos de referencia asociados a un brigadista
router.get('/verificar/:cedulaBrigadista', authMiddleware, referenciaController.VerificarPuntosReferencia);

module.exports = router; //Se exporta el router para ser usado en app.js