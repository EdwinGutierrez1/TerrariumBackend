    const authService = require('../services/auth.service');

    exports.login = async (req, res) => {
    console.log("Petición de login recibida", { email: req.body.email });
    
    try {
        const { email, password, idToken } = req.body;
        
        if (!idToken) {
        console.log("Error: No se proporcionó token");
        return res.status(400).json({ message: "Token de Firebase requerido" });
        }
        
        console.log("Verificando token con Firebase Admin...");
        const userData = await authService.verifyAndGetUserData(idToken);
        console.log("Token verificado correctamente, datos obtenidos:", { uid: userData.uid, email: userData.email });
        
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(401).json({ message: error.message });
    }
    };

    exports.getUserName = async (req, res) => {
    const { uid } = req.params;
    console.log(`Solicitud de nombre para usuario: ${uid}`);
    
    try {
        const nombre = await authService.getUserNameByUID(uid);
        console.log(`Nombre encontrado para ${uid}: ${nombre}`);
        res.status(200).json({ nombre });
    } catch (error) {
        console.error(`Error al buscar nombre para ${uid}:`, error.message);
        res.status(404).json({ message: error.message });
    }
    };