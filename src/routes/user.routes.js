const express = require('express');
const router = express.Router();

// Define tus rutas para usuarios
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de usuarios funcionando' });
});

module.exports = router;