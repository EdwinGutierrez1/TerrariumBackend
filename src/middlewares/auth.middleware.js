const admin = require('../config/firebase.config'); //Importamos el módulo de configuración para Firebase

/**
 * Middleware para verificar el token de autenticación. Protege las rutas que requieren autenticación
 *  req - Objeto de solicitud Express
 *  res - Objeto de respuesta Express
 *  next - Función para continuar con el siguiente middleware
 */

const verifyToken = async (req, res, next) => {
    try {

        // Se extrae el token del encabezado de autorización
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        
        // Verifica que exista un token
        if (!idToken) {
            return res.status(401).json({ message: 'No se proporcionó token de acceso' });
        }
        
        // Verifica el token con Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Se adjunta el usuario decodificado a la solicitud para uso posterior
        // Estamos agregando una nueva propiedad llamada "user" al objeto de solicitud (req) de Express.
        req.user = decodedToken;
        next();
    } catch (error) {
        // Error si el token es inválido o expirados
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = verifyToken; // Exporta la función middleware para que pueda ser importada en otros archivos