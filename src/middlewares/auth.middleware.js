    const admin = require('../config/firebase.config');

    const verifyToken = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        
        if (!idToken) {
        return res.status(401).json({ message: 'No se proporcionó token de acceso' });
        }
        
        // Verificar token con Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    };

    module.exports = verifyToken;