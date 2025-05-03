
//Controlador de Puntos de Referencia. Maneja las solicitudes HTTP relacionadas con los puntos de referencia añadidos por los brigadistas en el campo.

const referenciaService = require('../services/referencia.service'); //Importamos el modulo del servicio de puntos de referencia. 

/**
 * Obtiene el siguiente ID disponible para un nuevo punto de referencia. Estos id's son de la forma PR001, PR002, PR003...
 * req - Objeto de solicitud Express
 *  res - Objeto de respuesta Express
 *  devuelve una respuesta JSON con el siguiente ID disponible.
 */

exports.getSiguienteId = async (req, res) => {
    try {
        const siguienteId = await referenciaService.obtenerSiguienteId();
        return res.status(200).json({ siguienteId });
    } catch (error) { //Si se produce un error
        console.error('Error en getSiguienteId controller:', error);
        return res.status(500).json({ message: 'Error al obtener el siguiente ID de referencia' });
    }
};

/**
 * Guarda un nuevo punto de referencia en la base de datos
 * req - Objeto de solicitud Express con los datos del punto en req.body
 * res - Objeto de respuesta Express
 * retorna una respuesta JSON con el resultado de la operación
 */

exports.insertarReferencia = async (req, res) => {
    try {
      // Obtener datos del punto de referencia del cuerpo de la solicitud
        const puntoReferencia = req.body;
        
        // Guardar el punto de referencia usando el servicio correspondiente
        const id = await referenciaService.insertarReferencia(puntoReferencia);
        
        return res.status(201).json({ //Exito
            success: true, 
            message: 'Punto de referencia guardado correctamente', 
            id 
        });
        } catch (error) { //Error
        console.error('Error en insertarReferencia controller:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al guardar punto de referencia',
            error: error.message
        });
    }
};

/**
 * Actualiza un punto de referencia existente
 * Verifica que el ID en la URL coincida con el del cuerpo de la solicitud
 * req - Objeto de solicitud Express con id en params y datos en body
 * res - Objeto de respuesta Express
 * devuelve una respuesta JSON con el resultado de la operación
 */

exports.actualizarReferencia = async (req, res) => {
    try {
        const { id } = req.params;
        const puntoReferencia = req.body;
        
        // Validamos que el ID del parámetro coincida con el del cuerpo, esto ayuda a prevenir inconsistencias en la actualización

        if (id !== puntoReferencia.id) {
            return res.status(400).json({
            success: false,
            message: 'El ID del punto de referencia no coincide con el de la URL'
            });
        }
        
        const resultado = await referenciaService.actualizarReferencia(puntoReferencia); //Se llama al servicio para actualizar el punto de referencia, pasandole como parámetro dicho punto.
        
        if (resultado.success) { //Exito
            return res.status(200).json({
            success: true,
            message: 'Punto de referencia actualizado correctamente'
            });
        } else {
            // Si hay error, posiblemente por permisos insuficientes
            return res.status(403).json({
            success: false,
            message: resultado.error
            });
        }
        } catch (error) { //Si ocurre un error en toda la función de actualizarReferencia.
        console.error('Error en actualizarReferencia controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar punto de referencia',
            error: error.message
        });
        }
};

/**
 * Elimina un punto de referencia existente
 * Requiere la cédula del brigadista para verificar permisos
 * req - Objeto de solicitud Express con id en params y cédula en body
 * res - Objeto de respuesta Express
 * devuelve una Respuesta JSON con el resultado de la operación
 */
exports.eliminarReferencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula_brigadista } = req.body;
        
        // Verificamos que la cédula esté incluida en la solicitud
        if (!cedula_brigadista) {
            return res.status(400).json({
            success: false,
            message: 'Se requiere la cédula del brigadista'
            });
        }
        
        const resultado = await referenciaService.eliminarReferencia(id, cedula_brigadista); //Se llama al servicio de eliminar el punto de referencia, pasándole el id, y la cédula del brigadista.
        
        if (resultado.success) { //Exito
            return res.status(200).json({
            success: true,
            message: 'Punto de referencia eliminado correctamente',
            data: resultado.data
            });
        } else {
            // Si hay error, posiblemente por permisos insuficientes
            return res.status(403).json({
            success: false,
            message: resultado.error
            });
        }
        } catch (error) { //Si falla toda la función de eliminarReferencia.
        console.error('Error en eliminarReferencia controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar punto de referencia',
            error: error.message
        });
        }
};

/**
 * Obtiene un punto de referencia específico por su ID
 * req - Objeto de solicitud Express con id en params
 * res - Objeto de respuesta Express
 * devuelve una respuesta JSON con los datos del punto o un mensaje de error
 */

exports.obtenerReferenciaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const referencia = await referenciaService.obtenerReferenciaPorId(id); //Se llama al servicio para obtener el punto de referencia, pasándole su id.
        
        if (referencia) { //Exito
            return res.status(200).json({
            success: true,
            data: referencia
            });
        } else {
            return res.status(404).json({ //No se encontró el punto
            success: false,
            message: 'Punto de referencia no encontrado'
            });
        }
        } catch (error) { //Error en toda la función obtenerReferenciaPorId
        console.error('Error en obtenerReferenciaPorId controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener punto de referencia',
            error: error.message
        });
    }
};

/**
 * Obtiene todos los puntos de referencia asociados a un conglomerado específico
 * req - Objeto de solicitud Express con idConglomerado en params
 * res - Objeto de respuesta Express
 * devuelve una respuesta JSON con la lista de puntos o un mensaje de error
 */

exports.getPuntosReferenciaByConglomerado = async (req, res) => {
    try {
        const { idConglomerado } = req.params;
        
        if (!idConglomerado) { //Si no hay un id del conglomerado.
            return res.status(400).json({
                success: false,
                message: "Se requiere el ID del conglomerado"
            });
        }
        
        const puntos = await referenciaService.getPuntosReferenciaByConglomerado(idConglomerado); //Se llama al servicio para obtener los puntos de referencia del conglomerado.
        
        return res.status(200).json({ //Exito
            success: true,
            data: puntos
        });
    } catch (error) { //Error en la función
        console.error("Error en getPuntosReferenciaByConglomerado controller:", error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener puntos de referencia',
            error: error.message
        });
    }
};

/**
 * Verifica la cantidad de puntos de referencia asociados a un brigadista, es esencial para validar en el tutorial si el brigadista ha registrado algún punto. 
 * req - Objeto de solicitud Express con cedulaBrigadista en params
 * res - Objeto de respuesta Express
 * devuelve una respuesta JSON con la cantidad de puntos asociados al brigadista
 */
exports.VerificarPuntosReferencia = async (req, res) => {
    try {
        const { cedulaBrigadista } = req.params;
        
        if (!cedulaBrigadista) { //Si no hay una cedula del brigadista.
            return res.status(400).json({
                success: false,
                message: "Se requiere la cédula del brigadista"
            });
        }
        
        // Obtenemos la cantidad de puntos asociados a este brigadista, llamando al servicio correspondiente. 
        const cantidadPuntos = await referenciaService.VerificarPuntosReferencia(cedulaBrigadista);
        
        return res.status(200).json({
            success: true,
            cantidad: cantidadPuntos  // Cambié data por cantidad para ser más explícito
        });

    } catch (error) { //Si se produce un error en la función
        console.error("Error en VerificarPuntosReferencia controller:", error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la cantidad de puntos de referencia del brigadista',
            error: error.message
        });
    }
};