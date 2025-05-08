/**
 * Servicio de Puntos de Referencia
 * Contiene la lógica para gestionar los puntos de referencia geográficos, utilizados por los brigadistas en campo.
**/

const supabase = require('../config/supabase.config'); //Importamos el modulo de configuración de supabase.

/**
 * Genera el siguiente ID disponible para un nuevo punto de referencia. Los id's son del tipo PR001, PR002, PR003...
 * devuelve una string, que es el siguiente ID disponible con dicho formato.
 * Arroja un error si falla la consulta a la base de datos
 */

exports.obtenerSiguienteId = async () => {
    try {
        // Realiza una consulta a la tabla punto_referencia para obtener el último ID
        const { data, error } = await supabase
        .from("punto_referencia")
        .select("id")
        .order("id", { ascending: false }) 
        .limit(1);

        if (error) {
        console.error("Error al obtener el último ID:", error);
        throw error;
        }

        if (data.length === 0) {
        // Si no hay puntos en la tabla, el primer ID será PR001
        return "PR001";
        }

        // Obtener el último ID
        const ultimoId = data[0].id;

        // Extraer el número del ID (por ejemplo: PR001 -> 1)
        // Primero eliminamos el prefijo "PR" y luego convertimos la parte numérica a un número entero en base 10
        const numero = parseInt(ultimoId.replace("PR", ""), 10);

        // Incrementamos el número en uno para generar el siguiente ID
        const siguienteNumero = numero + 1;

        // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
        // Luego lo concatenamos con el prefijo "PR" para obtener el nuevo ID
        const siguienteId = `PR${siguienteNumero.toString().padStart(3, "0")}`;

        // Devolvemos el nuevo ID generado, por ejemplo: "PR002"
        return siguienteId;

    } catch (error) { //Si ocurre algún error en la función
        console.error("Error al obtener el siguiente ID:", error);
        throw error;
    }
};

/**
 * Inserta un nuevo punto de referencia en la base de datos
 * puntoReferencia - Objeto con los datos del punto de referencia
 * devuelve el ID del punto de referencia insertado
 */
exports.insertarReferencia = async (puntoReferencia) => {
    try {
      // Preparar el objeto de datos con los nombres correctos de columnas
        const puntoData = {
        id: puntoReferencia.id,
        latitud: puntoReferencia.latitud,
        longitud: puntoReferencia.longitud,
        descripcion: puntoReferencia.descripcion,
        error: puntoReferencia.error,
        cedula_brigadista: puntoReferencia.cedula_brigadista,
        tipo: puntoReferencia.tipo || 'Referencia' // Valor por defecto si no se especifica
        };

        // Insertar en la base de datos
        const { data, error } = await supabase
        .from('punto_referencia')
        .insert(puntoData)
        .select();
        
        if (error) throw error; //Si por alguna razón la inserción falla.
        
        // Devolver el ID del registro insertado
        return data[0].id;
        } catch (error) { //Si ocurre un error en la ejecución de la función
        console.error("Error al insertar punto de referencia:", error);
        throw error;
        }
};

/**
 * Actualiza un punto de referencia existente
 * Verifica que solo el brigadista que creó el punto pueda modificarlo
 * puntoReferencia - Objeto con los datos actualizados del punto
 * devuelve un bjeto con indicador de éxito o mensaje de error si aplica
 */
exports.actualizarReferencia = async (puntoReferencia) => {
    try {
      // Verificamos si el brigadista es el creador del punto
        const { data: puntoExistente, error: errorConsulta } = await supabase
            .from('punto_referencia')
            .select('cedula_brigadista')
            .eq('id', puntoReferencia.id)
            .single();
        
        if (errorConsulta) {
            return { success: false, error: "Error al consultar el punto de referencia" };
        }
        
        // Si el brigadista actual no es el creador, retornamos error
        if (puntoExistente.cedula_brigadista !== puntoReferencia.cedula_brigadista) {
            return { 
            success: false, 
            error: "No tienes permiso para modificar este punto. Solo el creador puede modificarlo." 
            };
        }
        
        // De lo contrario, preparamos los datos para actualizar
        const puntoData = {
            latitud: puntoReferencia.latitud,
            longitud: puntoReferencia.longitud,
            descripcion: puntoReferencia.descripcion,
            error: puntoReferencia.error,
            cedula_brigadista: puntoReferencia.cedula_brigadista,
        };
        
        // Actualizamos en la base de datos
        const { error } = await supabase
            .from('punto_referencia')
            .update(puntoData)
            .eq('id', puntoReferencia.id);
        
        if (error) {
            return { success: false, error: error.message }; //Si hay un error al intentar hacer el update.
        }
        
        return { success: true };
        } catch (error) { //Si hay un error en la ejercución de la función
        console.error("Error al actualizar punto de referencia:", error);
        return { success: false, error: error.message };
        }
};

/**
 * Elimina un punto de referencia existente
 * Verifica que solo el brigadista que creó el punto pueda eliminarlo
 * puntoId - ID del punto de referencia a eliminar
 * cedulaBrigadista - Cédula del brigadista que solicita la eliminación
 * devuelve un objeto con indicador de éxito y datos o un mensaje de error
 */
exports.eliminarReferencia = async (puntoId, cedulaBrigadista) => {
    try {
      // Verificamos si el brigadista es el creador del punto
        const { data: puntoExistente, error: errorConsulta } = await supabase
            .from('punto_referencia')
            .select('cedula_brigadista')
            .eq('id', puntoId)
            .single();
        
        if (errorConsulta) { //Si hay un error en la consulta.
            return { success: false, error: "Error al consultar el punto de referencia" };
        }
        
        // Si el punto no existe
        if (!puntoExistente) {
            return { success: false, error: "El punto de referencia no existe" };
        }
        
        // Si el brigadista actual no es el creador, retornamos error
        if (puntoExistente.cedula_brigadista !== cedulaBrigadista) {
            return { 
            success: false, 
            error: "No tienes permiso para eliminar este punto. Solo el creador puede eliminarlo." 
            };
        }
        
        // De lo contrario, eliminamos el punto de referencia
        const { data, error } = await supabase
            .from('punto_referencia')
            .delete()
            .eq('id', puntoId);
    
        if (error) {
            return { success: false, error: error.message }; //Si falla el delete.
        }
    
        console.log(`✅ Punto de referencia ${puntoId} eliminado correctamente`);
        return { success: true, data }; //Si se elimina correctamente.

        } catch (error) {
        console.error(`❌ Error al eliminar punto de referencia ${puntoId}:`, error);
        return { success: false, error: error.message }; //Si se produce un error en la ejecucución de la función.
        }
};

/**
 * Obtiene los datos de un punto de referencia por su ID
 * id - ID del punto de referencia
 * retorna los Datos del punto de referencia o null si no existe
 */
exports.obtenerReferenciaPorId = async (id) => {
    try {
        //consulta en la tabla "punto_referencia"
        const { data, error } = await supabase
            .from('punto_referencia')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        return data;

        } catch (error) { //Si se produce un error.
        console.error("Error al obtener referencia por ID:", error);
        throw error;
    }
};

/**
 * Obtiene todos los puntos de referencia asociados a un conglomerado, para ello se realizan múltiples consultas.
 * También se obtienen los trayectos asociados a cada punto de referencia
 * idConglomerado - ID del conglomerado a consultar
 * devuelve un Array de puntos de referencia con sus trayectos
 */
exports.getPuntosReferenciaByConglomerado = async (idConglomerado) => {
    try {
        if (!idConglomerado) {
            throw new Error("Se requiere el ID del conglomerado");
        }
        
        // Paso 1: Obtenemos el id de la brigada asociada al conglomerado
        const { data: brigadas, error: brigadasError } = await supabase
            .from('brigada')
            .select('id')
            .eq('id_conglomerado', idConglomerado);
        
        if (brigadasError) throw brigadasError; //Si se produce un error
        
        if (!brigadas || brigadas.length === 0) {
            return []; // No hay brigadas para este conglomerado
        }
        
        // Mapeamos el id de la brigada
        const brigadaIds = brigadas.map(brigada => brigada.id);
        
        // Paso 2: Obtenemos las cedulas de los brigadistas asociados a esta brigada
        const { data: brigadistas, error: brigadistasError } = await supabase
            .from('brigadista')
            .select('cedula')
            .in('id_brigada', brigadaIds);
        
        if (brigadistasError) throw brigadistasError;
        
        if (!brigadistas || brigadistas.length === 0) {
            return []; // No hay brigadistas para esta brigada
        }
        
        // Mapeamos las cédulas de los brigadistas, para que sean un array "sencillo"
        const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
        
        // Paso 3: Obtenemos los puntos de referencia asociados a estos brigadistas (usando la cédula)
        const { data: puntosData, error: puntosError } = await supabase
            .from('punto_referencia')
            .select('*')
            .neq('tipo', 'Centro Poblado')
            .in('cedula_brigadista', cedulasBrigadistas);
        
        if (puntosError) throw puntosError;
        
        if (!puntosData || puntosData.length === 0) {
            return []; // No hay puntos de referencia para estos brigadistas
        }

        //Obtenemos los id's de cada punto
        const puntoIds = puntosData.map(punto => punto.id);
        
        // Paso 4: Obtenemos los trayectos para cada punto
        const { data: trayectosData, error: trayectosError } = await supabase
            .from('trayecto')
            .select('*')
            .in('id_punto_referencia', puntoIds);
        
        if (trayectosError) throw trayectosError;
        
        // Paso 5: Combinamos los datos de puntos y trayectos
        const puntosConTrayectos = puntosData.map(punto => {

            // Filtramos los trayectos que corresponden a este punto en particular
            const trayectosDelPunto = trayectosData.filter(t => t.id_punto_referencia === punto.id);
            return {
                ...punto,
                trayectos: trayectosDelPunto.length > 0 ? trayectosDelPunto : []
            };
        });
        
        return puntosConTrayectos;
    } catch (error) {
        console.error("Error fetching puntos de referencia:", error);
        throw error;
    }
};

/**
 * Verifica y cuenta los puntos de referencia asociados a un brigadista
 * cedulaBrigadista - Cédula del brigadista a consultar
 * retorna la cantidad de puntos de referencia asociados al brigadista (dato de tipo numerico)
 */

exports.VerificarPuntosReferencia = async (cedulaBrigadista) => {
    try {
        if (!cedulaBrigadista) {
            console.warn("verificarPuntosReferencia: No se proporcionó cedulaBrigadista");
            return 0;
        }
    
        // Consulta específica para puntos de referencia
        const { data, error } = await supabase
            .from("punto_referencia")
            .select("id")
            .eq("cedula_brigadista", cedulaBrigadista)
            .eq("tipo", "Referencia");
    
        if (error) { //Error en al consulta.
            console.error("Error al consultar puntos de referencia:", error);
            return 0;
        }
    
        console.log(`Se encontraron ${data.length} puntos de referencia para el brigadista ${cedulaBrigadista}`);
        return data.length;

        } catch (err) { //Si se produce un error en la ejecucución de la función.
        console.error("Error inesperado al verificar puntos:", err);
        return 0;
        }
};


//FUNCION AÑADIDA SOSOCHI
exports.verificarCampamentoExistente = async (idConglomerado) => {
    try {
        console.log("⏳ Service: Verificando si existe campamento para conglomerado:", idConglomerado);
    
        // Validación inicial
        if (!idConglomerado) {
            console.error("❌ Service: Error: ID de conglomerado no proporcionado");
            return { existe: false, error: "ID de conglomerado no proporcionado" };
        }
    
        // Paso 1: Obtenemos el id de la brigada asociada al conglomerado
        console.log("🔍 Service: Consultando brigadas asociadas al conglomerado");
        const { data: brigadas, error: brigadasError } = await supabase
            .from('brigada')
            .select('id')
            .eq('id_conglomerado', idConglomerado);
        
        if (brigadasError) {
            console.error("❌ Service: Error al obtener brigadas:", brigadasError);
            return { existe: false, error: brigadasError.message };
        }
        
        if (!brigadas || brigadas.length === 0) {
            console.log("ℹ️ Service: No hay brigadas para este conglomerado");
            return { existe: false };
        }
        
        console.log(`✅ Service: Encontradas ${brigadas.length} brigadas para el conglomerado`);
        
        // Mapeamos el id de la brigada
        const brigadaIds = brigadas.map(brigada => brigada.id);
        
        // Paso 2: Obtenemos las cedulas de los brigadistas asociados a esta brigada
        console.log("🔍 Service: Consultando brigadistas asociados a las brigadas");
        const { data: brigadistas, error: brigadistasError } = await supabase
            .from('brigadista')
            .select('cedula')
            .in('id_brigada', brigadaIds);
        
        if (brigadistasError) {
            console.error("❌ Service: Error al obtener brigadistas:", brigadistasError);
            return { existe: false, error: brigadistasError.message };
        }
        
        if (!brigadistas || brigadistas.length === 0) {
            console.log("ℹ️ Service: No hay brigadistas para estas brigadas");
            return { existe: false };
        }
        
        console.log(`✅ Service: Encontrados ${brigadistas.length} brigadistas`);
        
        // Mapeamos las cédulas de los brigadistas
        const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
        
        // Paso 3: Verificamos si existe algún punto de tipo "Campamento" asociado a estos brigadistas
        console.log("🔍 Service: Verificando puntos de tipo Campamento");
        const { data: campamentoData, error: campamentoError } = await supabase
            .from('punto_referencia')
            .select('id')
            .eq('tipo', 'Campamento')
            .in('cedula_brigadista', cedulasBrigadistas);
        
        if (campamentoError) {
            console.error("❌ Service: Error al verificar campamentos:", campamentoError);
            return { existe: false, error: campamentoError.message };
        }
        
        // Verificamos si hay algún punto de tipo "Campamento"
        const existeCampamento = campamentoData && campamentoData.length > 0;
        
        console.log(
            `✅ Service: Verificación completada: ${existeCampamento ? "Existe" : "No existe"} campamento para conglomerado ${idConglomerado}`
        );
        return { 
            existe: existeCampamento, 
            id: existeCampamento ? campamentoData[0].id : null 
        };
    } catch (err) {
        console.error("🚨 Service: Error inesperado en verificarCampamentoExistente:", err);
        return { existe: false, error: err.message };
    }
};