const express = require('express');
const router = express.Router();
const subparcelaController = require('../controllers/subparcela.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/sincronizar', authMiddleware, subparcelaController.sincronizarSubparcelas);

module.exports = router;    