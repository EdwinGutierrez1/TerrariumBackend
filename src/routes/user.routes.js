const express = require('express');
const router = express.Router(); // Crea una instancia del enrutador de Express

// Ruta GET base para usuarios
// Responde con un mensaje simple para confirmar que la ruta está activa
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de usuarios funcionando' });
});

// Exportar el router para que pueda ser usado en app.js
module.exports = router;
