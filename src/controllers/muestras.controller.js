const muestraService = require("../services/muestras.service");

exports.siguienteIdMuestra = async (req, res) => {
  try {
    const ultimoId = await muestraService.obtenerSiguienteIdMuestra();
    if (ultimoId === null) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener el último ID de muestra",
        });
    }
    return res.status(200).json({ success: true, ultimoId });
  } catch (error) {
    console.error("Error en obtenerUltimoIdMuestra:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Error al obtener el último ID de muestra",
      });
  }
};

exports.almacenarMuestra = async (req, res) => {
  try {
    const {
      idMuestra,
      tamanoIndividuo,
      nombreComun,
      determinacionCampo,
      observaciones,
      numeroColeccion,
      arbol,
      cedula_brigadista,
    } = req.body;

    const muestra = {
      idMuestra,
      tamanoIndividuo,
      nombreComun,
      determinacionCampo,
      observaciones,
      numeroColeccion,
      arbol,
      cedula_brigadista,
    };

    const data = await muestraService.almacenarMuestra(muestra);

    return res.status(200).json({ success: true, id: data });
  } catch (error) {
    console.error("Error en almacenarMuestra:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al almacenar la muestra",
    });
  }
};