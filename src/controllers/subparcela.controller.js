// backend/controllers/subparcela.controller.js
const subparcelaService = require('../services/subparcela.service');

exports.sincronizarSubparcelas = async (req, res) => {
    try {
    const subparcelasCaracteristicas = req.body;
    
    if (!subparcelasCaracteristicas || Object.keys(subparcelasCaracteristicas).length === 0) {
        return res.status(400).json({
        success: false,
        message: 'No se proporcionaron datos de subparcelas para sincronizar'
        });
    }
    
    const resultados = await subparcelaService.sincronizarSubparcelas(subparcelasCaracteristicas);
    
    return res.status(200).json({
        success: true,
        data: resultados
    });
    } catch (error) {
    console.error('Error en sincronizarSubparcelas controller:', error);
    return res.status(500).json({
        success: false,
        message: 'Error al sincronizar subparcelas',
        error: error.message
    });
    }
};