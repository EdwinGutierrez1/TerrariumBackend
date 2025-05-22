//LISTO
// Importamos el servicio de muestras que contiene la lógica de negocio
const muestraService = require("../services/muestras.service");

/**
 * Obtiene el siguiente ID disponible para una nueva muestra
 * El formato del ID sigue el patrón "M" seguido de un número de 3 dígitos (ej: M001)
 */

exports.siguienteIdMuestra = async (req, res) => {
  try {
    // Llama al servicio para obtener el siguiente ID basado en el último registro
    const ultimoId = await muestraService.obtenerSiguienteIdMuestra();
    
    // Si no se pudo obtener el ID, devuelve un error
    if (ultimoId === null) {
      return res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener el último ID de muestra",
        });
    }
    
    // Devuelve el ID generado en caso de éxito
    return res.status(200).json({ success: true, ultimoId });
  } catch (error) {
    // Maneja cualquier error durante el proceso
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Error al obtener el último ID de muestra",
      });
  }
};

/**
 * Registra una nueva muestra en la base de datos
 * Procesa los datos recibidos y los envía al servicio para su almacenamiento
 */

exports.almacenarMuestra = async (req, res) => {
  try {
    // Desestructura los datos necesarios del cuerpo de la solicitud
    const {
      idMuestra,                
      nombreComun,          
      determinacionCampo,  
      observaciones,        
      numeroColeccion,     
      arbol,              
    } = req.body;

    // Construye el objeto de muestra con los datos recibidos
    const muestra = {
      idMuestra,
      nombreComun,
      determinacionCampo,
      observaciones,
      numeroColeccion,
      arbol,
    };

    // Llama al servicio para almacenar la muestra en la base de datos
    const data = await muestraService.almacenarMuestra(muestra);

    // Devuelve una respuesta exitosa con el ID de la muestra almacenada
    return res.status(200).json({ success: true, id: data });
  } catch (error) {
    // Maneja cualquier error durante el proceso de almacenamiento
    return res.status(500).json({
      success: false,
      error: error.message || "Error al almacenar la muestra",
    });
  }
};