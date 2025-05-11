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