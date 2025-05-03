const express = require('express'); // Importamos el framework Express para crear y gestionar rutas HTTP
const router = express.Router(); // Creamos un nuevo enrutador de Express para definir rutas específicas y agruparlas de manera organizada
const authController = require('../controllers/auth.controller'); // Importamos el controlador de autenticación que contiene las funciones que manejarán la lógica para cada ruta

// Rutas de autenticación
//Se usa post para enviar datos y get para obtenerlos.

// Ruta para verificar token y obtener datos de usuario
router.post('/verify-token', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

//Ruta para obtener el nombre de usuario por UID
router.get('/username/:uid', authController.getUserName);

module.exports = router; //Se exporta el router para que pueda ser utilizado en otros archivos.