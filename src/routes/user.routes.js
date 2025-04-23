const express = require('express');
const router = express.Router();

// Define tus rutas para usuarios
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de usuarios funcionando' });
});

// Añade más rutas según necesites
// router.get('/:id', getUserById);
// router.post('/', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

module.exports = router;