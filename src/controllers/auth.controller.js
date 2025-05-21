//LISTO//
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
    if (!idToken) {    //Si no hay ningún token o está vacío.
      return res.status(400).json({ message: "Token de Firebase requerido" }); //Se arroja un mensaje de error
    }
    
    // Verificación del token y obtención de datos
    const userData = await authService.verifyAndGetUserData(idToken); // Se usa la función verifyAndGetUserData del archivo auth.service, pasándole como parametro el token.
    
    // Respuesta exitosa - envía como respuesta el objeto userData convertido a formato JSON
    res.status(200).json(userData);

  } catch (error) {

    // Manejo de errores de autenticación
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
  
  try {

    // Obtención del nombre desde el servicio
    const nombre = await authService.getUserNameByUID(uid);  // Se usa la función getUserNameByUID del archivo auth.service, pasándole como parametro el UID.
    res.status(200).json({ nombre });

  } catch (error) {
    // Manejo de errores cuando no se encuentra el usuario
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
  
    // Simplemente respondemos con un mensaje de confirmación.
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};