// routes/referencia.routes.js
const express = require('express');
const router = express.Router();
const referenciaController = require('../controllers/referencia.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // Asumiendo que tienes un middleware de autenticación

// Ruta para obtener el siguiente ID
router.get('/siguiente-id', authMiddleware, referenciaController.getSiguienteId);
router.post('/', authMiddleware, referenciaController.insertarReferencia);
router.put('/:id', authMiddleware, referenciaController.actualizarReferencia);
router.delete('/:id', authMiddleware, referenciaController.eliminarReferencia);
router.get('/conglomerado/:idConglomerado', referenciaController.getPuntosReferenciaByConglomerado);
router.get('/:id', authMiddleware, referenciaController.obtenerReferenciaPorId);

module.exports = router;