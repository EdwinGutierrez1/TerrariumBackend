//LISTO
// Se importan los servicios necesarios
const trayectoService = require('../services/trayecto.service');
const referenciaService = require('../services/referencia.service');

/**
 * Guarda un nuevo trayecto asociado a un punto de referencia
 * Verifica permisos del brigadista antes de realizar la operación
 * retorna un objeto, que es una respuesta JSON con el resultado de la operación
 */

exports.guardarTrayecto = async (req, res) => {
  try {
    const { datosTrayecto, puntoId } = req.body; //Se obtienen los datos del trayecto y el ID del punto de referencia
    const cedulaBrigadista = datosTrayecto.cedula_brigadista; //Se obtiene la cédula del brigadista

    // Verificar que el punto de referencia exista, haciendo uso del servicio correspondiente
    const puntoReferencia = await referenciaService.obtenerReferenciaPorId(puntoId);

    if (!puntoReferencia) { //Si no existe
      return res.status(404).json({ 
        success: false,
        error: "El punto de referencia no existe" 
      });
    }

    // Verificar que el punto de referencia pertenezca al brigadista
    if (puntoReferencia.cedula_brigadista !== cedulaBrigadista) {
      return res.status(403).json({ 
        success: false, 
        error: "No tienes permisos para añadir trayectos a este punto de referencia" 
      });
    }

    // Se ejecuta el servicio correspondiente para insertar el trayecto en la BD.
    const result = await trayectoService.insertarTrayecto(datosTrayecto, puntoId);
    
    // Responde con éxito y los datos del trayecto creado
    return res.status(201).json(result);

  } catch (error) {  //Manejo de errores
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al guardar el trayecto" 
    });
  }
};

/**
 * Actualiza un trayecto existente asociado a un punto de referencia
 * Verifica permisos del brigadista y existencia del trayecto antes de realizar la operación
 * req - Objeto de solicitud Express
 * devuelve una respuesta JSON con el resultado de la operación
 */

exports.actualizarTrayecto = async (req, res) => {
  try {
    const { datosTrayecto, puntoId } = req.body; //Se obtienen los datos del trayecto y el ID del punto de referencia
    const cedulaBrigadista = datosTrayecto.cedula_brigadista; //Se obtiene la cédula del brigadista

    // Verifica que el punto de referencia exista
    const puntoReferencia = await referenciaService.obtenerReferenciaPorId(puntoId);

    if (!puntoReferencia) { //Si no existe 
      return res.status(404).json({ 
        success: false,
        error: "El punto de referencia no existe" 
      });
    }

    // Verifica que el punto de referencia pertenezca al brigadista 
    // Nota: Se hace conversión a String para asegurar comparación de tipos iguales
    if (String(puntoReferencia.cedula_brigadista) !== String(cedulaBrigadista)) {
      return res.status(403).json({ 
        success: false, 
        error: "No tienes permisos para modificar este punto de referencia" 
      });
    }

    // Validar existencia del trayecto haciendo uso del servicio correspondiente.
    const trayectoExistente = await trayectoService.obtenerTrayectoPorId(datosTrayecto.idTrayecto);
    if (!trayectoExistente) {
      return res.status(404).json({
        success: false,
        error: "El trayecto no existe"
      });
    }

    // Se actualiza el trayecto haciendo uso del servicio correspondiente.
    const result = await trayectoService.actualizarTrayecto(datosTrayecto, puntoId);
    
    // Responde con éxito y los datos actualizados
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {  // Manejo de errores
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al actualizar el trayecto" 
    });
  }
};

/**
 * Obtiene el siguiente ID disponible para un nuevo trayecto
 * devuelve una Respuesta JSON con el siguiente ID disponible
 */

exports.obtenerIdTrayecto = async (req, res) => {
  try {

    // Obtiene el siguiente ID disponible para el trayecto, usando el servicio correspondiente.
    const siguienteId = await trayectoService.obtenerSiguienteIdTrayecto();
    
    if (!siguienteId) { //Si no se pudo obtener el ID.
      return res.status(404).json({
        success: false,
        error: "No se pudo generar el siguiente ID para el trayecto"
      });
    }
    
    // Si se pudo obtener, responde con el ID generado
    return res.status(200).json({
      success: true,
      data: { siguienteId }
    });

  } catch (error) {  // Manejo de errores
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al obtener el siguiente ID de trayecto" 
    });
  }
};

