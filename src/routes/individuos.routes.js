    // routes/individuos.routes.js
    const express = require('express');
    const router = express.Router();
    const individuosController = require('../controllers/individuos.controller');
    const authMiddleware = require('../middlewares/auth.middleware');

    // Ruta GET para obtener el siguiente ID disponible para individuos
    router.get('/siguienteId', authMiddleware, individuosController.siguienteIdIndividuo);

    // Modificado: Cambio de parámetro de ruta a query parameter para los IDs de subparcelas
    router.get('/conglomerado', authMiddleware, individuosController.getIndividuosByConglomerado);

    //ruta para guardar un individuo
    router.post('/guardar', authMiddleware, individuosController.guardarIndividuo);

    module.exports = router;