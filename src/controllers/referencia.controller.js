//LISTO
//Controlador de Puntos de Referencia. Maneja las solicitudes HTTP relacionadas con los puntos de referencia añadidos por los brigadistas en el campo.
const referenciaService = require('../services/referencia.service'); //Importamos el modulo del servicio de puntos de referencia. 
const brigadistaService = require('../services/brigadista.service');  //Importamos el modulo del servicio de brigadistas.


//Obtiene el siguiente ID disponible para un nuevo punto de referencia. Estos id's son de la forma PR001, PR002, PR003...

exports.getSiguienteId = async (req, res) => {
    try {
        const siguienteId = await referenciaService.obtenerSiguienteId(); //Se llama al servicio para obtener el siguiente id.
        return res.status(200).json({ siguienteId }); //Se retorna el siguiente id.
    } catch (error) { //Si se produce un error
        return res.status(500).json({ message: 'Error al obtener el siguiente ID de referencia' });
    }
};

/**
 * Guarda un nuevo punto de referencia en la base de datos
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
        return res.status(500).json({ 
            success: false, 
            message: 'Error al guardar punto de referencia',
            error: error.message
        });
    }
};

/**
 * Actualiza un punto de referencia existente
 * devuelve una respuesta JSON con el resultado de la operación
 */

exports.actualizarReferencia = async (req, res) => {
    try {
        const { id } = req.params; //Obtenemos el id del punto de referencia de los parámetros de la solicitud.
        const puntoReferencia = req.body; //Obtenemos el punto de referencia del cuerpo de la solicitud.
        
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
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar punto de referencia',
            error: error.message
        });
        }
};

/**
 * Elimina un punto de referencia existente
 * devuelve una Respuesta JSON con el resultado de la operación
 */

exports.eliminarReferencia = async (req, res) => {
    try {
        const { id } = req.params; //Obtenemos el id del punto de referencia de los parámetros de la solicitud.
        const { cedula_brigadista } = req.body; //Obtenemos la cédula del brigadista del cuerpo de la solicitud.
        
        // Verificamos que la cédula esté incluida en la solicitud
        if (!cedula_brigadista) {
            return res.status(400).json({
            success: false,
            message: 'Se requiere la cédula del brigadista'
            });
        }
        
        const resultado = await referenciaService.eliminarReferencia(id, cedula_brigadista); //Se llama al servicio de eliminar el punto de referencia, pasándole el id del punto, y la cédula del brigadista.
        
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
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar punto de referencia',
            error: error.message
        });
        }
};

/**
 * Obtiene un punto de referencia específico usando su ID
 * devuelve una respuesta JSON con los datos del punto o un mensaje de error
 */

exports.obtenerReferenciaPorId = async (req, res) => {
    try {
        const { id } = req.params; //Obtenemos el id del punto de referencia de los parámetros de la solicitud.
        
        const referencia = await referenciaService.obtenerReferenciaPorId(id); //Se llama al servicio para obtener el punto de referencia, pasándole su id.
        
        if (referencia) {  //Exito
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
        return res.status(500).json({
            success: false,
            message: 'Error al obtener punto de referencia',
            error: error.message
        });
    }
};

/**
 * Obtiene todos los puntos de referencia asociados a un conglomerado específico
 * devuelve una respuesta JSON con la lista de puntos o un mensaje de error
 */

exports.getPuntosReferenciaByConglomerado = async (req, res) => {
    try {
        const { idConglomerado } = req.params; //Obtenemos el id del conglomerado de los parámetros de la solicitud.
        
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
        return res.status(500).json({
            success: false,
            message: 'Error al obtener puntos de referencia',
            error: error.message
        });
    }
};

/**
 * Verifica la cantidad de puntos de referencia asociados a un brigadista, es esencial para validar en el tutorial si el brigadista (en este caso, el jefe de brigada) ha registrado algún punto. 
 * devuelve una respuesta JSON con la cantidad de puntos asociados al brigadista
 */

exports.VerificarPuntosReferencia = async (req, res) => {
    try {
        const { cedulaBrigadista } = req.params; //Obtenemos la cédula del brigadista de los parámetros de la solicitud.
        
        if (!cedulaBrigadista) { //Si no hay una cedula del brigadista.
            return res.status(400).json({
                success: false,
                message: "Se requiere la cédula del brigadista"
            });
        }
        
        // Obtenemos la cantidad de puntos asociados a este brigadista, llamando al servicio correspondiente. 
        const cantidadPuntos = await referenciaService.VerificarPuntosReferencia(cedulaBrigadista);
        
        return res.status(200).json({ //Exito
            success: true,
            cantidad: cantidadPuntos  
        });

    } catch (error) { //Si se produce un error en la función
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la cantidad de puntos de referencia del brigadista',
            error: error.message
        });
    }
};

/**
 * Verifica la existencia de un campamento en el conglomerado asignado al brigadista actual
 * Esta función realiza las siguientes operaciones:
 * 1. Extrae el identificador del usuario (UID) de la sesión autenticada
 * 2. Obtiene la información del brigadista incluyendo su conglomerado asignado
 * 3. Verifica si existe un campamento registrado en el conglomerado del brigadista
 */

exports.verificarCampamento = async (req, res) => {
    try {
        const uid = req.user?.uid; // Usamos el operador ? para prevenir errores si req.user es undefined
        
        // Verificamos si tenemos el uid del usuario autenticado
        if (!uid) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado correctamente'
            });
        }
        
        // Obtenemos la información del brigadista para conocer su id_conglomerado
        const brigadistaInfo = await brigadistaService.getInfoBrigadista(uid);
        
        // Verificamos si se encontró información del brigadista
        if (!brigadistaInfo) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró información del brigadista'
            });
        }
        
        // Verificamos si el brigadista tiene un conglomerado asignado
        if (!brigadistaInfo.idConglomerado) {
            return res.status(404).json({
                success: false,
                message: 'El brigadista no tiene un conglomerado asignado'
            });
        }
    
        // Llamamos al servicio para verificar si existe un campamento en el conglomerado, pasando el id_conglomerado del brigadista como parámetro
        const resultado = await referenciaService.verificarCampamentoExistente(brigadistaInfo.idConglomerado);
        
        // Verificamos si hubo un error en el servicio
        if (resultado.error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar campamento',
                error: resultado.error,
                existeCampamento: false
            });
        }
    
        // Devolvemos la respuesta exitosa con información sobre la existencia del campamento
        return res.status(200).json({
            success: true,
            existeCampamento: resultado.existe,
            idCampamento: resultado.id
        });
    } catch (error) {
        // Capturamos cualquier error no manejado y devolvemos una respuesta de error genérica
        return res.status(500).json({
            success: false,
            message: 'Error al verificar campamento: ' + (error.message || 'Error desconocido'),
            existeCampamento: false
        });
    }
};