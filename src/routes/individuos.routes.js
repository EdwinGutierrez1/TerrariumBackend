    //LISTO
    const express = require('express'); // Se importa el módulo de Express
    const router = express.Router(); // Se crea un enrutador de Express
    const individuosController = require('../controllers/individuos.controller'); // Se importa el controlador de los individuos.
    const authMiddleware = require('../middlewares/auth.middleware');  // Se importa el middleware de autenticación.

    // Ruta GET para obtener el siguiente ID disponible para individuos
    router.get('/siguienteId', authMiddleware, individuosController.siguienteIdIndividuo);

    //Ruta GET para obtener los individuos del conglomerado.
    router.get('/conglomerado', authMiddleware, individuosController.getIndividuosByConglomerado);

    //ruta POST para guardar un individuo
    router.post('/guardar', authMiddleware, individuosController.guardarIndividuo);

    module.exports = router; // Se exporta el enrutador de Express.