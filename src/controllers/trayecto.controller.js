// backend/controllers/trayectoController.js
const trayectoService = require('../services/trayectoService');
const referenciaService = require('../services/referenciaService'); // Deberás crear este servicio

exports.guardarTrayecto = async (req, res) => {
  try {
    const { datosTrayecto, puntoId } = req.body;
    const cedulaBrigadista = datosTrayecto.cedula_brigadista;

    // Verificar que el punto de referencia pertenezca al brigadista
    const puntoReferencia = await referenciaService.obtenerReferenciaPorId(puntoId);

    if (!puntoReferencia) {
      return res.status(404).json({ 
        success: false,
        error: "El punto de referencia no existe" 
      });
    }

    if (puntoReferencia.cedula_brigadista !== cedulaBrigadista) {
      return res.status(403).json({ 
        success: false, 
        error: "No tienes permisos para añadir trayectos a este punto de referencia" 
      });
    }

    const result = await trayectoService.insertarTrayecto(datosTrayecto, puntoId);
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error en guardarTrayecto:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al guardar el trayecto" 
    });
  }
};



exports.actualizarTrayecto = async (req, res) => {
  try {
    const { datosTrayecto, puntoId } = req.body;
    const cedulaBrigadista = datosTrayecto.cedula_brigadista;

    // Verificar que el punto de referencia pertenezca al brigadista
    const puntoReferencia = await referenciaService.obtenerReferenciaPorId(puntoId);

    if (!puntoReferencia) {
      return res.status(404).json({ 
        success: false,
        error: "El punto de referencia no existe" 
      });
    }

    if (String(puntoReferencia.cedula_brigadista) !== String(cedulaBrigadista)) {
      return res.status(403).json({ 
        success: false, 
        error: "No tienes permisos para modificar este punto de referencia" 
      });
    }

    // Validar trayecto
    const trayectoExistente = await trayectoService.obtenerTrayectoPorId(datosTrayecto.idTrayecto);
    if (!trayectoExistente) {
      return res.status(404).json({
        success: false,
        error: "El trayecto no existe"
      });
    }

    const result = await trayectoService.actualizarTrayecto(datosTrayecto, puntoId);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error en actualizarTrayecto:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al actualizar el trayecto" 
    });
  }
};

/*
exports.obtenerTrayecto = async (req, res) => {
  try {
    const { id } = req.params;
    const trayecto = await trayectoService.obtenerTrayectoPorId(id);
    
    if (!trayecto) {
      return res.status(404).json({
        success: false,
        error: "Trayecto no encontrado"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: trayecto
    });
  } catch (error) {
    console.error('Error en obtenerTrayecto:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Error al obtener el trayecto" 
    });
  }
};

module.exports = {
  guardarTrayecto,
  actualizarDatosTrayecto,
  obtenerTrayecto
};*/