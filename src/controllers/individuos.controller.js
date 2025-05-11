const individuoService = require('../services/individuos.service');

// Controlador para obtener el siguiente ID de individuo
exports.siguienteIdIndividuo = async (req, res) => {
  try {
    const ultimoId = await individuoService.obtenerSiguienteIdIndividuo();
    
    if (ultimoId === null) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener el último ID de individuo",
        });
    }
    
    return res.status(200).json({ success: true, ultimoId });
  } catch (error) {
    console.error("Error en obtenerUltimoIdIndividuo:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Error al obtener el último ID de individuo",
      });
  }
};

exports.getIndividuosByConglomerado = async (req, res) => {
  try {
    // Obtenemos los IDs desde query parameters y los convertimos a array
    const idsString = req.query.ids;
    
    if (!idsString) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron IDs de subparcelas"
      });
    }

    // Convertimos la cadena de IDs en un array
    const subparcelasIds = idsString.split(',').map(id => id.trim());

    // Validación del array de IDs
    if (!subparcelasIds.length) {
      return res.status(400).json({
        success: false,
        message: "El array de IDs de subparcelas está vacío"
      });
    }

    // Se ejecuta el servicio correspondiente para obtener los individuos por conglomerado
    const individuos = await individuoService.getIndividuosByConglomerado(
      subparcelasIds
    );

    // Responde con éxito y los datos obtenidos
    return res.status(200).json({
      success: true,
      data: individuos
    });
  } catch (error) {
    console.error("Error en getIndividuosByConglomerado controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener individuos por conglomerado",
      error: error.message
    });
  }
};