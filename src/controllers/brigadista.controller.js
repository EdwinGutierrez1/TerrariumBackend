const brigadistaService = require('../services/brigadista.service');

// Controlador para obtener información del brigadista
exports.getInfoBrigadista = async (req, res) => {
  try {
    const uid = req.user.uid; // Asumiendo que tienes un middleware de autenticación
    const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
    
    if (!brigadistaInfo) {
      return res.status(404).json({ message: 'No se encontró información del brigadista' });
    }
    
    return res.status(200).json(brigadistaInfo);
  } catch (error) {
    console.error('Error en getInfoBrigadista controller:', error);
    return res.status(500).json({ message: 'Error al obtener información del brigadista' });
  }
};

// Controlador para actualizar el estado del tutorial
exports.updateTutorialCompletado = async (req, res) => {
  try {
    const uid = req.user.uid; // Asumiendo que tienes un middleware de autenticación
    const { completado } = req.body;
    
    const result = await brigadistaService.updateTutorialCompletado(uid, completado);
    return res.status(200).json({ message: 'Tutorial actualizado correctamente', data: result });
  } catch (error) {
    console.error('Error en updateTutorialCompletado controller:', error);
    return res.status(500).json({ message: 'Error al actualizar estado del tutorial' });
  }
};