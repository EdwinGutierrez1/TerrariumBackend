//Este archivo recibe las solicitudes HTTP y se encarga de llamar a los servicios correspondientes, manejando errores y respondiendo al cliente.

const brigadistaService = require('../services/brigadista.service'); //Se importa el módulo de servicios de brigadista, que se encuentra en el archivo brigadista.service.js

// Controlador para obtener información del brigadista autenticado
exports.getInfoBrigadista = async (req, res) => {
  try {
    const uid = req.user.uid; // Extraemos el UID desde el token (middleware de autenticación)
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid); // Llamamos al servicio, y le pasamos como parámetro el UID.
    
    if (!brigadistaInfo) { //Si no se encuentra información del brigadista
      return res.status(404).json({ message: 'No se encontró información del brigadista' });
    }
    
    return res.status(200).json(brigadistaInfo); //Respondemos con los datos obtenidos
  } catch (error) { 
    console.error('Error en getInfoBrigadista controller:', error);
    return res.status(500).json({ message: 'Error al obtener información del brigadista' });
  }
};

// Controlador para actualizar el estado del tutorial (completado o no)
exports.updateTutorialCompletado = async (req, res) => {
  try {
    const uid = req.user.uid; // Obtenemos el UID del usuario autenticado desde el token
    const { completado } = req.body; // Extraemos el valor "completado" desde el cuerpo del request. Se espera que sea true o false.

     // Llamamos al servicio que se encarga de actualizar el campo "tutorial_completado" en la base de datos
    const result = await brigadistaService.updateTutorialCompletado(uid, completado);

    return res.status(200).json({ message: 'Tutorial actualizado correctamente', data: result }); // respuesta de éxito con el resultado de la operación

  } catch (error) {  // Si ocurre algún error, respondemos con un error 500.
    console.error('Error en updateTutorialCompletado controller:', error);
    return res.status(500).json({ message: 'Error al actualizar estado del tutorial' });
  }
};