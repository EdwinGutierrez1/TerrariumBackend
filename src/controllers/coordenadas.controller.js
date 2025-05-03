
const coordenadasService = require('../services/coordenadas.service'); // Importamos el servicio que contiene la lógica relacionada con las coordenadas y la BD.
const brigadistaService = require('../services/brigadista.service'); // Importamos el servicio del brigadista para conocer a qué conglomerado pertenece

// Controlador para obtener las coordenadas de las subparcelas del brigadista autenticado
exports.getCoordenadasSubparcelas = async (req, res) => {
  try {
    const uid = req.user.uid; // Obtenemos el UID del usuario autenticado

    // Obtenemos la información del brigadista para conocer su id_conglomerado
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    if (!brigadistaInfo) {
      return res.status(404).json({  //Error si no se encuentra info del brigadista
        success: false,
        message: 'No se encontró información del brigadista' 
      });
    }

    // Obtenemos las coordenadas usando el id del conglomerado del brigadista
    const coordenadas = await coordenadasService.getCoordenadasSubparcelas(brigadistaInfo.idConglomerado);
    
    return res.status(200).json({
      success: true,
      data: coordenadas
    });
  } catch (error) { //Si se produce un error
    console.error('Error en getCoordenadas controller:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener coordenadas' 
    });
  }
};

// Controlador para obtener la ubicación del Centro Poblado más cercano al conglomerado del brigadista
exports.getCentroPoblado = async (req, res) => {
  try {
    const uid = req.user.uid;

    //Obtenemos la información del brigadista autenticado
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    if (!brigadistaInfo) { //Si se produce error
      return res.status(404).json({ 
        success: false,
        message: 'No se encontró información del brigadista' 
      });
    }

    //Obtenemos los centros poblados relacionados a la brigada del brigadista, llamando al servicio de coordenadas.
    //Se lleva a cabo la función getCentroPoblado, del archivo coordenadas.service, pasandole como parametro la brigada del brigadista.
    const centroPoblado = await coordenadasService.getCentroPoblado(brigadistaInfo.brigada);
    
    return res.status(200).json({
      success: true,
      data: centroPoblado
    });
  } catch (error) { //Si se produce error.
    console.error('Error en getCentroPoblado controller:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al obtener centro poblado' 
    });
  }
};
