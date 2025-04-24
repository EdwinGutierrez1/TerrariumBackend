// routes/referencia.routes.js
const express = require('express');
const router = express.Router();
const referenciaController = require('../controllers/referencia.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/siguiente-id', authMiddleware, referenciaController.getSiguienteId);
router.post('/', authMiddleware, referenciaController.insertarReferencia);
router.put('/:id', authMiddleware, referenciaController.actualizarReferencia);
router.delete('/:id', authMiddleware, referenciaController.eliminarReferencia);
router.get('/conglomerado/:idConglomerado', referenciaController.getPuntosReferenciaByConglomerado);
router.get('/punto/:id', authMiddleware, referenciaController.obtenerReferenciaPorId);
router.get('/verificar/:cedulaBrigadista', authMiddleware, referenciaController.VerificarPuntosReferencia);

module.exports = router;