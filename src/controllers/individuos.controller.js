//LISTO
const individuoService = require('../services/individuos.service'); // Se importa el módulo de servicios de los individuos árboreos, para poder usar las funciones definidas en individuos.service.js

// Controlador para obtener el siguiente ID de individuo
exports.siguienteIdIndividuo = async (req, res) => {
  try {
    const ultimoId = await individuoService.obtenerSiguienteIdIndividuo(); //Llamamos a la función obtenerSiguienteIdIndividuo del servicio. Lo que retorna esta funcion lo almacenamos en la variable ultimoId.
    
    if (ultimoId === null) { //Si no se encuentra el último ID, respondemos con un error.
      return res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener el último ID de individuo",
        });
    }
    
    return res.status(200).json({ success: true, ultimoId }); //Si se encuentra el último ID

  } catch (error) { //Si se produce un error
    return res //
      .status(500)
      .json({ 
        success: false,
        error: error.message || "Error al obtener el último ID de individuo", 
      });
  }
};

exports.guardarIndividuo = async (req, res) => {
  try {

    // Extraemos todos los campos necesarios del cuerpo de la petición
    const datosIndividuo = req.body;

    // Llamamos al servicio para guardar el individuo, y pasamos estos datos como parámetro.
    // Esto retorna el ID del individuo guardado, que se almacena en la variable data.
    const data = await individuoService.guardarIndividuo(datosIndividuo);

    return res.status(200).json({ success: true, id: data }); //Si se guarda correctamente, respondemos con el ID del individuo guardado.
  } catch (error) { //Si se produce un error
    return res.status(500).json({
      success: false,
      error: error.message || "Error al guardar el individuo",
    });
  }
};


exports.getIndividuosByConglomerado = async (req, res) => {
  try {

    // Obtenemos los IDs de las subparcelas desde query parameters y los convertimos a array
    const idsString = req.query.ids;
    
    if (!idsString) { //Si no se proporcionan IDs
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

    // Se ejecuta el servicio correspondiente para obtener los individuos por conglomerado, y se le pasan los IDs de las subparcelas como parámetro.
    const individuos = await individuoService.getIndividuosByConglomerado(
      subparcelasIds
    );

    // Responde con éxito y los datos obtenidos
    return res.status(200).json({
      success: true,
      data: individuos
    });

  //Captura y manejo de errores.  
  } catch (error) { 
    return res.status(500).json({
      success: false,
      message: "Error al obtener individuos por conglomerado",
      error: error.message
    });
  }
};