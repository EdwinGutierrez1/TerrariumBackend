// src/controllers/coordenadas.controller.js
const coordenadasService = require('../services/coordenadas.service');
const brigadistaService = require('../services/brigadista.service');

// Controlador para obtener coordenadas del brigadista
exports.getCoordenadas = async (req, res) => {
  try {
    const uid = req.user.uid; // El middleware de autenticación añade esta información
    
    // Primero obtenemos la información del brigadista para saber su conglomerado
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    if (!brigadistaInfo) {
      return res.status(404).json({ 
        success: false,
        message: 'No se encontró información del brigadista' 
      });
    }
    
    // Luego obtenemos las coordenadas usando el ID del conglomerado
    const coordenadas = await coordenadasService.getCoordenadas(brigadistaInfo.idConglomerado);
    
    return res.status(200).json({
      success: true,
      data: coordenadas
    });
  } catch (error) {
    console.error('Error en getCoordenadas controller:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener coordenadas' 
    });
  }
};