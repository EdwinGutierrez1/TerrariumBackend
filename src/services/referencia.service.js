//LISTO
//Servicio de Puntos de Referencia. Contiene la lógica para gestionar los puntos de referencia geográficos, utilizados por los brigadistas en campo.
const supabase = require('../config/supabase.config'); //Importamos el modulo de configuración de supabase.


 //Genera el siguiente ID disponible para un nuevo punto de referencia. Los id's son del tipo PR001, PR002, PR003...

exports.obtenerSiguienteId = async () => {
    try {
        // Realiza una consulta a la tabla punto_referencia para obtener el último ID
        const { data, error } = await supabase
        .from("punto_referencia")
        .select("id")
        .order("id", { ascending: false })  //Ordenamos por ID de manera descendente
        .limit(1); //Limitamos a 1 solo resultado

        if (error) { //Si hay un error en la consulta
            throw error;
        }

        if (data.length === 0) {
            // Si no hay puntos en la tabla, el primer ID será PR001
            return "PR001";
        }

        // Obtenemos el último ID
        const ultimoId = data[0].id;

        // Extraemos el número del ID (por ejemplo: PR001 -> 1)
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
        throw error;
    }
};

/**
 * Inserta un nuevo punto de referencia en la base de datos
 * devuelve el ID del punto de referencia insertado
 */

exports.insertarReferencia = async (puntoReferencia) => {
    try {
        // Prepara el objeto de datos con los nombres correctos de columnas
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
            .select(); //Seleccionamos todos los campos.
        
        if (error) throw error; //Si por alguna razón la inserción falla.
        
        // Devolver el ID del registro insertado
        return data[0].id;
    } catch (error) { //Si ocurre un error en la ejecución de la función
        throw error;
    }
};

/**
 * Actualiza un punto de referencia existente. Verifica que solo el brigadista que creó el punto pueda modificarlo
 * devuelve un bjeto con indicador de éxito o mensaje de error si aplica
 */

exports.actualizarReferencia = async (puntoReferencia) => {
    try {
        // Verificamos si el brigadista es el creador del punto. Para ello obtenemos la cédula del brigadista, del punto de referencia en Base de datos, cuyo id
        // coincide con el id del punto de referencia que se quiere modificar.

        const { data: puntoExistente, error: errorConsulta } = await supabase
            .from('punto_referencia')
            .select('cedula_brigadista')
            .eq('id', puntoReferencia.id)
            .single(); 
        
        if (errorConsulta) { //Si hay un error en la consulta.
            return { success: false, error: "Error al consultar el punto de referencia" };
        }
        
        // Si el brigadista actual no es el creador, retornamos error. Comparamos la cedula del brigadista que creó el punto, con la cedula del brigadista que
        // está intentando modificar el punto. Si son diferentes, retornamos error.

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
            tipo: puntoReferencia.tipo,
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
    } catch (error) { //Si hay un error en la ejecución de la función
        return { success: false, error: error.message };
    }
};

/**
 * Elimina un punto de referencia existente. Verifica que solo el brigadista que creó el punto pueda eliminarlo
 * devuelve un objeto con indicador de éxito y datos o un mensaje de error
 */

exports.eliminarReferencia = async (puntoId, cedulaBrigadista) => {
    try {
        // Verificamos si el brigadista es el creador del punto. De la misma manera que se verifica en "actualizarReferencia".
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
        
        // Si el brigadista actual no es el creador, retornamos error. Otra vez, se comparan las cédulas.
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
    
        return { success: true, data }; //Si se elimina correctamente.

    } catch (error) {
        return { success: false, error: error.message }; //Si se produce un error en la ejecucución de la función.
    }
};

/**
 * Obtiene los datos de un punto de referencia por su ID
 * retorna estos datos o null si no existe
 */

exports.obtenerReferenciaPorId = async (id) => {
    try {

        //consulta en la tabla "punto_referencia"
        const { data, error } = await supabase
            .from('punto_referencia')
            .select('*')
            .eq('id', id)
            .single(); //Como solo se espera un resultado, usamos single()
        
        if (error) throw error; //Si hay un error
        
        return data; //Si no lo hay, se retornan los datos del punto de referencia.

    } catch (error) { //Si se produce un error.
        throw error;
    }
};

/**
 * Obtiene todos los puntos de referencia asociados a un conglomerado, para ello se realizan múltiples consultas.
 * También se obtienen los trayectos asociados a cada punto de referencia
 * devuelve un Array de puntos de referencia con sus trayectos
 */

exports.getPuntosReferenciaByConglomerado = async (idConglomerado) => {
    try {
        if (!idConglomerado) { //Si no se proporciona el id del conglomerado
            throw new Error("Se requiere el ID del conglomerado");
        }
        
        // Paso 1: Obtenemos el id de la brigada asociada al conglomerado
        const { data: brigadas, error: brigadasError } = await supabase
            .from('brigada')
            .select('id')
            .eq('id_conglomerado', idConglomerado);
        
        if (brigadasError) throw brigadasError; //Si se produce un error
        
        if (!brigadas || brigadas.length === 0) {
            return []; // Si no hay una brigada para este conglomerado
        }
        
        // Mapeamos el id de la brigada
        const brigadaIds = brigadas.map(brigada => brigada.id);
        
        // Paso 2: Obtenemos las cedulas de los brigadistas asociados a esta brigada
        const { data: brigadistas, error: brigadistasError } = await supabase
            .from('brigadista')
            .select('cedula')
            .in('id_brigada', brigadaIds);
        
        if (brigadistasError) throw brigadistasError; //Si se produce un error
        
        if (!brigadistas || brigadistas.length === 0) {
            return []; // Si no hay brigadistas para esta brigada.
        }
        
        // Mapeamos las cédulas de los brigadistas, para que sean un array "sencillo"
        const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
        
        // Paso 3: Obtenemos los puntos de referencia asociados a estos brigadistas (usando sus cédulas)
        const { data: puntosData, error: puntosError } = await supabase
            .from('punto_referencia')
            .select('*')
            .neq('tipo', 'Centro Poblado') //Excluimos los puntos de tipo "Centro Poblado"
            .in('cedula_brigadista', cedulasBrigadistas); //La cedula del brigadista que creó el punto de referencia, debe estar en el array cedulasBrigadistas.
        
        if (puntosError) throw puntosError; //Si se produce un error
        
        if (!puntosData || puntosData.length === 0) {
            return []; // No hay puntos de referencia para estos brigadistas
        }

        //Obtenemos los id's de cada punto
        const puntoIds = puntosData.map(punto => punto.id);
        
        // Paso 4: Obtenemos los trayectos para cada punto
        const { data: trayectosData, error: trayectosError } = await supabase
            .from('trayecto')
            .select('*')
            .in('id_punto_referencia', puntoIds); //El id del punto de referencia, debe estar en el array puntoIds.
        
        if (trayectosError) throw trayectosError;
        
        // Paso 5: Combinamos los datos de puntos y trayectos
        const puntosConTrayectos = puntosData.map(punto => {

            // Filtramos los trayectos que corresponden a este punto en particular
            const trayectosDelPunto = trayectosData.filter(t => t.id_punto_referencia === punto.id);
            return {
                ...punto,
                trayectos: trayectosDelPunto.length > 0 ? trayectosDelPunto : [] //Si hay trayectos, se retornan. Si no, se retorna un array vacío.
            };
        });
        
        return puntosConTrayectos; 
    } catch (error) {
        throw error;
    }
};

/**
 * Verifica y cuenta los puntos de referencia asociados a un brigadista
 */

exports.VerificarPuntosReferencia = async (cedulaBrigadista) => {
    try {
        if (!cedulaBrigadista) { //Si no se proporciona la cédula del brigadista
            return 0;
        }
    
        //Obtenemos los id's de los puntos de referencia asociados a la cédula del brigadista, y que sean de tipo "Referencia".
        const { data, error } = await supabase
            .from("punto_referencia")
            .select("id")
            .eq("cedula_brigadista", cedulaBrigadista)
            .eq("tipo", "Referencia");
    
        if (error) { //Error en al consulta.
            return 0;
        }
    
        return data.length; //Si no hay errores, se retornan la cantidad de puntos de referencia.

    } catch (err) { //Si se produce un error en la ejecucución de la función.
        return 0;
    }
};

//Verifica si existe un campamento asociado a un conglomerado específico.

exports.verificarCampamentoExistente = async (idConglomerado) => {
    try {        
        // Validación inicial del parámetro de entrada
        if (!idConglomerado) {
            return { existe: false, error: "ID de conglomerado no proporcionado" };
        }
    
        // PASO 1: Obtener brigadas asociadas al conglomerado
        // Consultamos la tabla 'brigada' para encontrar registros vinculados al conglomerado proporcionado
        const { data: brigadas, error: brigadasError } = await supabase
            .from('brigada')
            .select('id') //Obtenemos el id de la brigada
            .eq('id_conglomerado', idConglomerado);
        
        // Manejo de error en la consulta de brigadas
        if (brigadasError) {
            return { existe: false, error: brigadasError.message };
        }
        
        // Si no hay brigadas asociadas, no puede haber campamento
        if (!brigadas || brigadas.length === 0) {
            return { existe: false };
        }

        // Extraemos los IDs de todas las brigadas encontradas
        const brigadaIds = brigadas.map(brigada => brigada.id);
        
        // PASO 2: Obtener brigadistas asociados a las brigadas encontradas
        // Consultamos la tabla 'brigadista' filtrando por los IDs de brigadas.
        const { data: brigadistas, error: brigadistasError } = await supabase
            .from('brigadista')
            .select('cedula') //Seleccionamos la cédula de cada brigadista.
            .in('id_brigada', brigadaIds);
        
        // Manejo de error en la consulta de brigadistas
        if (brigadistasError) {
            return { existe: false, error: brigadistasError.message };
        }
        
        // Si no hay brigadistas, no puede haber campamento
        if (!brigadistas || brigadistas.length === 0) {
            return { existe: false };
        }
        
        // Extraemos las cédulas de todos los brigadistas encontrados
        const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
        
        // PASO 3: Verificar existencia de punto tipo "Campamento" asociado a los brigadistas
        // Consultamos la tabla 'punto_referencia' buscando registros de tipo Campamento, que estén asociados a alguno de los brigadistas encontrados
        const { data: campamentoData, error: campamentoError } = await supabase
            .from('punto_referencia')
            .select('id')
            .eq('tipo', 'Campamento')
            .in('cedula_brigadista', cedulasBrigadistas); //Se compara usando la cédula del brigadista.
        
        // Manejo de error en la consulta de puntos de referencia
        if (campamentoError) {
            return { existe: false, error: campamentoError.message };
        }
        
        // Determinamos si existe al menos un campamento
        const existeCampamento = campamentoData && campamentoData.length > 0;
        
        // Retornamos el resultado con el estado de existencia y el ID del primer campamento encontrado (si existe)
        return { 
            existe: existeCampamento, 
            id: existeCampamento ? campamentoData[0].id : null 
        };
    } catch (err) {
        // Capturamos cualquier error no controlado en las consultas o procesamiento
        return { existe: false, error: err.message };
    }
};