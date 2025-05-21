
//LISTO
const coordenadasService = require('../services/coordenadas.service'); // Importamos el servicio que contiene la lógica relacionada con las coordenadas y centros poblados.
const brigadistaService = require('../services/brigadista.service'); // Importamos el servicio del brigadista para conocer a qué conglomerado pertenece

// Controlador para obtener las coordenadas de las subparcelas del brigadista autenticado
exports.getCoordenadasSubparcelas = async (req, res) => {
  try {
    const uid = req.user.uid; // Obtenemos el UID del usuario autenticado

    // Obtenemos la información del brigadista para conocer su id_conglomerado
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    //Error si no se encuentra info del brigadista
    if (!brigadistaInfo) {
      return res.status(404).json({  
        success: false,
        message: 'No se encontró información del brigadista' 
      });
    }

    //Se llama a la función getCoordenadasSubparcelas para obtener las coordenadas usando el id del conglomerado del brigadista.
    const coordenadas = await coordenadasService.getCoordenadasSubparcelas(brigadistaInfo.idConglomerado);
    
    return res.status(200).json({ //Si se obtienen las coordenadas con éxito, se devuelve un objeto JSON con el estado de éxito y los datos de las coordenadas.
      success: true,
      data: coordenadas
    });
  } catch (error) { //Si se produce un error
    return res.status(500).json({  //Se devuelve un objeto JSON con el estado de error y un mensaje de error.
      success: false,
      message: 'Error al obtener coordenadas' 
    });
  }
};

// Controlador para obtener la ubicación del Centro Poblado más cercano al conglomerado del brigadista
exports.getCentroPoblado = async (req, res) => {
  try {
    const uid = req.user.uid; //Obtenemos el UID del usuario autenticado.

    //Obtenemos la información del brigadista autenticado, haciendo uso del servicio de brigadista.
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    if (!brigadistaInfo) { //Si se produce error
      return res.status(404).json({  //Se devuelve un objeto JSON con el estado de error y un mensaje de error.
        success: false,
        message: 'No se encontró información del brigadista' 
      });
    }

    //Obtenemos los centros poblados relacionados a la brigada del brigadista, llamando al servicio de coordenadas.
    //Se lleva a cabo la función getCentroPoblado del servicio de coordenadas, pasandole como parametro el id de la brigada del brigadista.

    const centroPoblado = await coordenadasService.getCentroPoblado(brigadistaInfo.brigada);
    
    return res.status(200).json({ //Si se obtiene el centro poblado con éxito.
      success: true,
      data: centroPoblado
    });
  } catch (error) {   //Si se produce error.
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener centro poblado' 
    });
  }
};
