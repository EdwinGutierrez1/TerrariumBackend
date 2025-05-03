const authService = require('../services/auth.service'); // Se importa el módulo de servicios de autenticación, para poder usar las funciones definidas en auth.service.js

/**
 * Controlador para el inicio de sesión. Verifica un token de Firebase y devuelve los datos del usuario
 *  req - Objeto de solicitud Express
 *  req.body - Cuerpo de la solicitud
 *  req.body.idToken - Token de ID de Firebase a verificar
 *  res - Objeto de respuesta Express
 *  Devuelve un objeto con los datos del usuario o en su defecto un mensaje de error
 */


exports.login = async (req, res) => {
  
  try {
    const {idToken } = req.body;
    
    // Validación de datos de entrada
    if (!idToken) { //Si no hay ningpún token o está vacío.
      console.log("Error: No se proporcionó token");
      return res.status(400).json({ message: "Token de Firebase requerido" });
    }
    
    // Verificación del token y obtención de datos
    console.log("Verificando token con Firebase Admin...");
    const userData = await authService.verifyAndGetUserData(idToken); // Se usa la función verifyAndGetUserData del archivo auth.service, pasándole como parametro el token.
    console.log("Token verificado correctamente, datos obtenidos:", { uid: userData.uid, email: userData.email });
    
    // Respuesta exitosa - envía como respuesta el objeto userData convertido a formato JSON
    res.status(200).json(userData);

  } catch (error) {

    // Manejo de errores de autenticación
    console.error("Error en login:", error.message);
    res.status(401).json({ message: error.message });
  }
};

/**
 * Controlador para obtener el nombre de un usuario por su UID
 *  req - Objeto de solicitud Express
 *  req.params - Parámetros de la URL
 *  req.params.uid - UID del usuario
 *  res - Objeto de respuesta Express
 *  Se retorna el nombre del usuario o en su defecto un mensaje de error
 */


exports.getUserName = async (req, res) => {
  const { uid } = req.params;
  console.log(`Solicitud de nombre para usuario: ${uid}`);
  
  try {

    // Obtención del nombre desde el servicio
    const nombre = await authService.getUserNameByUID(uid);  // Se usa la función getUserNameByUID del archivo auth.service, pasándole como parametro el UID.
    console.log(`Nombre encontrado para ${uid}: ${nombre}`);
    res.status(200).json({ nombre });

  } catch (error) {
    // Manejo de errores cuando no se encuentra el usuario
    console.error(`Error al buscar nombre para ${uid}:`, error.message);
    res.status(404).json({ message: error.message });
  }
};

/**
 * Controlador para manejar el cierre de sesión. Solo devuelve una respuesta de éxito
 *  req - Objeto de solicitud Express
 *  res - Objeto de respuesta Express
 *  Retorna un mensaje de confirmación
 */

exports.logout = async (req, res) => {
  
    // Simplemente respondemos con éxito
    console.log("Petición de logout recibida");
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};