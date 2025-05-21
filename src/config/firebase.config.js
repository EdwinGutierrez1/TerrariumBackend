// Importa la biblioteca de Firebase Admin SDK para Node.js
const admin = require('firebase-admin');

// Importa el archivo de credenciales generado desde la consola de Firebase
// Este archivo contiene las claves privadas necesarias para autenticar con Firebase
const serviceAccount = require('./firebase-adminsdk.json');

// Inicializa la aplicación de Firebase Admin con las credenciales
// Esta configuración permite que el servidor interactúe con los servicios de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Exporta la instancia de Firebase Admin configurada
// Esto permite importar esta instancia en otros archivos del proyecto
module.exports = admin;