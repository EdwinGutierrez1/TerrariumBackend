//LISTO
// Se importa el servicio que contiene la lógica relacionada a las subparcelas
const subparcelaService = require("../services/subparcela.service");

/**
 * Sincroniza las subparcelas recibidas desde el cliente con la base de datos
 * devuelve un objeto, que es una respuesta JSON con el estado de la sincronización y datos resultantes
 */

exports.sincronizarSubparcelas = async (req, res) => {
  try {
    const subparcelasCaracteristicas = req.body; // Datos de las subparcelas recibidos desde el cliente

    // Validación: Verifica que se hayan proporcionado datos para sincronizar
    if (
      !subparcelasCaracteristicas ||
      Object.keys(subparcelasCaracteristicas).length === 0
    ) {
      return res.status(400).json({ //Si no se proporcionaron datos, respondemos con un error 400
        success: false,
        message: "No se proporcionaron datos de subparcelas para sincronizar",
      });
    }

    // Se ejecuta el servicio correspondiente para sincronizar las subparcelas.
    const resultados = await subparcelaService.sincronizarSubparcelas(
      subparcelasCaracteristicas
    );

    // Responde con éxito y los datos procesados
    return res.status(200).json({
      success: true,
      data: resultados,
    });
  } catch (error) {     // Manejo de errores
    return res.status(500).json({
      success: false,
      message: "Error al sincronizar subparcelas",
      error: error.message,
    });
  }
};

/**
 * Obtiene los árboles de una subparcela específica
 * devuelve una Respuesta JSON con los árboles de la subparcela o un mensaje de error
 */

exports.getArbolesSubparcela = async (req, res) => {
  try {
    const { nombreSubparcela, conglomeradoId } = req.params; // Parámetros de la ruta

    // Validación de parámetros requeridos
    if (!nombreSubparcela || !conglomeradoId) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan parámetros necesarios para obtener árboles de la subparcela",
      });
    }

    // Obtiene los árboles de la subparcela mediante el servicio correspondiente. Se le pasan como parámetros el nombre de la subparcela y el ID del conglomerado.
    const arboles = await subparcelaService.getArbolesSubparcela(
      nombreSubparcela,
      conglomeradoId
    );
    
    // Responde con los datos obtenidos
    return res.status(200).json({
      success: true,
      data: arboles,
    });
  } catch (error) {     // Manejo de errores
    return res.status(500).json({
      success: false,
      message: "Error al obtener árboles de la subparcela",
      error: error.message,
    });
  }
};

/**
 * Obtiene las características de una subparcela específica
* Devuelve una respuesta JSON con las características de la subparcela o un mensaje de error
 */
exports.getCaracteristicasSubparcela = async (req, res) => {
    try {
        const { nombreSubparcela, conglomeradoId } = req.params; // Parámetros de la ruta

        // Validación de parámetros requeridos
        if (!nombreSubparcela || !conglomeradoId) {
          return res.status(400).json({
              success: false,
              message:
              "Faltan parámetros necesarios para obtener características de la subparcela",
          });
        }
    
        // Obtiene las características de la subparcela mediante el servicio correspondiente. Se le pasan como parámetros el nombre de la subparcela y el ID del conglomerado.
        const caracteristicas = await subparcelaService.getCaracteristicasByIdSubparcela(
          nombreSubparcela,
          conglomeradoId
        );
        
        // Responde con los datos obtenidos
        return res.status(200).json({
          success: true,
          data: caracteristicas,
        });

    } catch (error) {
        // Manejo de errores
        return res.status(500).json({
          success: false,
          message: "Error al obtener características de la subparcela",
          error: error.message,
        });
    }
};

/**
 * Obtiene el ID de una subparcela a partir de su nombre y el ID del conglomerado
* Devuelve una respuesta JSON con el ID de la subparcela o un mensaje de error
 */
exports.getSubparcelaId = async (req, res) => {
  try {
    const { nombreSubparcela, conglomeradoId } = req.query; //parámetros de la ruta

    // Validación de parámetros requeridos
    if (!nombreSubparcela || !conglomeradoId) {
      return res.status(400).json({
        success: false,
        message: "Faltan parámetros necesarios para obtener ID de subparcela",
      });
    }

    // Obtiene el ID de la subparcela mediante el servicio correspondiente. Se pasan como parámetros el nombre de la subparcela y el ID del conglomerado.
    const id = await subparcelaService.getSubparcelaId(
      nombreSubparcela,
      conglomeradoId
    );
    
    // Responde con el ID obtenido
    return res.status(200).json({
      success: true,
      id: id,
    });

  } catch (error) { // Manejo de errores 
    return res.status(500).json({
      success: false,
      message: "Error al obtener ID de subparcela",
      error: error.message,
    });
  }
};

/**
 * Obtiene los IDs de todas las subparcelas pertenecientes a un conglomerado específico
 * devuelve una respuesta JSON con los IDs de las subparcelas o un mensaje de error
 */
exports.getIdsSubparcelasByConglomerado = async (req, res) => {
  try {
    const { conglomeradoId } = req.params; // Parámetros de la ruta

    // Validación de parámetros requeridos
    if (!conglomeradoId) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan parámetros necesarios para obtener ID de subparcelas por conglomerado",
      });
    }

    // Obtiene los IDs de las subparcelas mediante el servicio correspondiente. Se pasa como parámetro el ID del conglomerado.	
    const subparcelasIds = await subparcelaService.getSubparcelasIdByConglomerado(
      conglomeradoId
    );
    
    // Responde con los datos obtenidos
    return res.status(200).json({
      success: true,
      data: subparcelasIds,
    });

  } catch (error) {
    // Manejo de errores
    return res.status(500).json({
      success: false,
      message: "Error al obtener ID de subparcelas por conglomerado",
      error: error.message,
    });
  }
};