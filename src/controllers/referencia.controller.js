// controllers/referencia.controller.js
const referenciaService = require('../services/referencia.service');

// Controlador para obtener el siguiente ID de referencia
exports.getSiguienteId = async (req, res) => {
    try {
        const siguienteId = await referenciaService.obtenerSiguienteId();
        return res.status(200).json({ siguienteId });
    } catch (error) {
        console.error('Error en getSiguienteId controller:', error);
        return res.status(500).json({ message: 'Error al obtener el siguiente ID de referencia' });
    }
};

exports.insertarReferencia = async (req, res) => {
    try {
      // Obtener datos del punto de referencia del cuerpo de la solicitud
        const puntoReferencia = req.body;
        
        // La cédula ya viene incluida en los datos enviados desde el frontend
        // No necesitamos extraerla del token
        
        // Guardar la referencia
        const id = await referenciaService.insertarReferencia(puntoReferencia);
        
        return res.status(201).json({ 
            success: true, 
            message: 'Punto de referencia guardado correctamente', 
            id 
        });
        } catch (error) {
        console.error('Error en insertarReferencia controller:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al guardar punto de referencia',
            error: error.message
        });
    }
};