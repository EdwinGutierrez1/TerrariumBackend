/**
 * Controlador de Subparcelas
 * Este archivo maneja las solicitudes HTTP relacionadas con la funcionalidad de subparcelas.
 */

// Se importa el servicio que contiene la lógica relacionada a las subparcelas
const subparcelaService = require('../services/subparcela.service');

/**
 * Sincroniza las subparcelas recibidas desde el cliente con la base de datos
 * req - Objeto de solicitud Express
 * req.body - Contiene un objeto donde cada clave es un ID de subparcela y cada valor contiene las características (coberturas y afectaciones)
 * res - Objeto de respuesta Express
 * devuelve un objeto, que es una respuesta JSON con el estado de la sincronización y datos resultantes
 */
exports.sincronizarSubparcelas = async (req, res) => {
    try {
    const subparcelasCaracteristicas = req.body;
    
    // Validación: Verifica que se hayan proporcionado datos para sincronizar
    if (!subparcelasCaracteristicas || Object.keys(subparcelasCaracteristicas).length === 0) {
        return res.status(400).json({
        success: false,
        message: 'No se proporcionaron datos de subparcelas para sincronizar'
        });
    }
    
    // Se ejecuta el servicio correspondiente para sincronizar las subparcelas.
    const resultados = await subparcelaService.sincronizarSubparcelas(subparcelasCaracteristicas);
    
    // Responde con éxito y los datos procesados
    return res.status(200).json({
        success: true,
        data: resultados
    });
    } catch (error) {
    // Manejo de errores 
    console.error('Error en sincronizarSubparcelas controller:', error);
    return res.status(500).json({
        success: false,
        message: 'Error al sincronizar subparcelas',
        error: error.message
    });
    }
};

exports.getArbolesSubparcela = async (req, res) => {
    try {
        const { nombreSubparcela, conglomeradoId } = req.params; // Desestructuramos los parámetros de la solicitud

        // Validación: Verifica que se hayan proporcionado los parámetros necesarios
        if (!nombreSubparcela || !conglomeradoId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros necesarios para obtener árboles de la subparcela'
            });
        }

        // Se ejecuta el servicio correspondiente para obtener los árboles de la subparcela
        const arboles = await subparcelaService.getArbolesSubparcela(nombreSubparcela, conglomeradoId);

        // Responde con éxito y los datos obtenidos
        return res.status(200).json({
            success: true,
            data: arboles
        });
    } catch (error) { //Si se produce un error
        console.error('Error en getArbolesSubparcela controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener árboles de la subparcela',
            error: error.message
        });
    }
};