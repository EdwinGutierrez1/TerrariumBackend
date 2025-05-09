const muestraService = require('../services/muestras.service');

exports.ultimoIdMuestra = async (req, res) => {
  try {
    const ultimoId = await muestraService.getUltimoIdMuestra();
    if (ultimoId === null) {
      return res.status(500).json({ success: false, error: "Error al obtener el último ID de muestra" });
    }
    return res.status(200).json({ success: true, ultimoId });
  } catch (error) {
    console.error('Error en obtenerUltimoIdMuestra:', error);
    return res.status(500).json({ success: false, error: error.message || "Error al obtener el último ID de muestra" });
  }
};