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

exports.actualizarReferencia = async (req, res) => {
    try {
        const { id } = req.params;
        const puntoReferencia = req.body;
        
        // Validamos que el ID del parámetro coincida con el del cuerpo
        if (id !== puntoReferencia.id) {
            return res.status(400).json({
            success: false,
            message: 'El ID del punto de referencia no coincide con el de la URL'
            });
        }
        
        const resultado = await referenciaService.actualizarReferencia(puntoReferencia);
        
        if (resultado.success) {
            return res.status(200).json({
            success: true,
            message: 'Punto de referencia actualizado correctamente'
            });
        } else {
            return res.status(403).json({
            success: false,
            message: resultado.error
            });
        }
        } catch (error) {
        console.error('Error en actualizarReferencia controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar punto de referencia',
            error: error.message
        });
        }
};

exports.eliminarReferencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula_brigadista } = req.body;
        
        if (!cedula_brigadista) {
            return res.status(400).json({
            success: false,
            message: 'Se requiere la cédula del brigadista'
            });
        }
        
        const resultado = await referenciaService.eliminarReferencia(id, cedula_brigadista);
        
        if (resultado.success) {
            return res.status(200).json({
            success: true,
            message: 'Punto de referencia eliminado correctamente',
            data: resultado.data
            });
        } else {
            return res.status(403).json({
            success: false,
            message: resultado.error
            });
        }
        } catch (error) {
        console.error('Error en eliminarReferencia controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar punto de referencia',
            error: error.message
        });
        }
};

exports.obtenerReferenciaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const referencia = await referenciaService.obtenerReferenciaPorId(id);
        
        if (referencia) {
            return res.status(200).json({
            success: true,
            data: referencia
            });
        } else {
            return res.status(404).json({
            success: false,
            message: 'Punto de referencia no encontrado'
            });
        }
        } catch (error) {
        console.error('Error en obtenerReferenciaPorId controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener punto de referencia',
            error: error.message
        });
    }
};