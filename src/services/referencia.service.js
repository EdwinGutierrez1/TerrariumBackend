// services/referencia.service.js
const supabase = require('../config/supabase.config');

// Servicio para obtener el siguiente ID de referencia
exports.obtenerSiguienteId = async () => {
    try {
        // Realiza una consulta a la tabla punto_referencia
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

        // Extraer el número del ID (ejemplo: PR001 -> 1)
        const numero = parseInt(ultimoId.replace("PR", ""), 10);

        // Generar el siguiente ID
        const siguienteNumero = numero + 1;
        const siguienteId = `PR${siguienteNumero.toString().padStart(3, "0")}`;

        return siguienteId;
    } catch (error) {
        console.error("Error al obtener el siguiente ID:", error);
        throw error;
    }
};

// Servicio para insertar una nueva referencia
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
        tipo: puntoReferencia.tipo || 'Referencia'
        };
      // Insertar en la base de datos
        const { data, error } = await supabase
        .from('punto_referencia')
        .insert(puntoData)
        .select();
        if (error) throw error;
        
        // Devolver el ID del registro insertado
        return data[0].id;
        } catch (error) {
        console.error("Error al insertar punto de referencia:", error);
        throw error;
        }
};

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
        
        // Preparamos los datos para actualizar
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
            return { success: false, error: error.message };
        }
        
        return { success: true };
        } catch (error) {
        console.error("Error al actualizar punto de referencia:", error);
        return { success: false, error: error.message };
        }
};

exports.eliminarReferencia = async (puntoId, cedulaBrigadista) => {
    try {
      // Verificamos si el brigadista es el creador del punto
        const { data: puntoExistente, error: errorConsulta } = await supabase
            .from('punto_referencia')
            .select('cedula_brigadista')
            .eq('id', puntoId)
            .single();
        
        if (errorConsulta) {
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
        
        // Eliminamos el punto de referencia
        const { data, error } = await supabase
            .from('punto_referencia')
            .delete()
            .eq('id', puntoId);
    
        if (error) {
            return { success: false, error: error.message };
        }
    
        console.log(`✅ Punto de referencia ${puntoId} eliminado correctamente`);
        return { success: true, data };
        } catch (error) {
        console.error(`❌ Error al eliminar punto de referencia ${puntoId}:`, error);
        return { success: false, error: error.message };
        }
};

exports.obtenerReferenciaPorId = async (id) => {
    try {
        const { data, error } = await supabase
            .from('punto_referencia')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        return data;
        } catch (error) {
        console.error("Error al obtener referencia por ID:", error);
        throw error;
    }
};

// Nueva función para obtener puntos de referencia por ID de conglomerado
exports.getPuntosReferenciaByConglomerado = async (idConglomerado) => {
    try {
        if (!idConglomerado) {
            throw new Error("Se requiere el ID del conglomerado");
        }
        
        // Obtenemos las brigadas asociadas al conglomerado
        const { data: brigadas, error: brigadasError } = await supabase
            .from('brigada')
            .select('id')
            .eq('id_conglomerado', idConglomerado);
        
        if (brigadasError) throw brigadasError;
        
        if (!brigadas || brigadas.length === 0) {
            return []; // No hay brigadas para este conglomerado
        }
        
        // Obtenemos los IDs de las brigadas
        const brigadaIds = brigadas.map(brigada => brigada.id);
        
        // Obtenemos los brigadistas asociados a estas brigadas
        const { data: brigadistas, error: brigadistasError } = await supabase
            .from('brigadista')
            .select('cedula')
            .in('id_brigada', brigadaIds);
        
        if (brigadistasError) throw brigadistasError;
        
        if (!brigadistas || brigadistas.length === 0) {
            return []; // No hay brigadistas para estas brigadas
        }
        
        // Obtenemos las cédulas de los brigadistas
        const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
        
        // Ahora obtenemos los puntos de referencia asociados a estos brigadistas (por cédula)
        const { data: puntosData, error: puntosError } = await supabase
            .from('punto_referencia')
            .select('*')
            .eq('tipo', 'Referencia')
            .in('cedula_brigadista', cedulasBrigadistas);
        
        if (puntosError) throw puntosError;
        
        if (!puntosData || puntosData.length === 0) {
            return []; // No hay puntos de referencia para estos brigadistas
        }
        
        // Obtenemos los trayectos para cada punto
        const puntoIds = puntosData.map(punto => punto.id);
        
        const { data: trayectosData, error: trayectosError } = await supabase
            .from('trayecto')
            .select('*')
            .in('id_punto_referencia', puntoIds);
        
        if (trayectosError) throw trayectosError;
        
        // Combinamos los datos
        const puntosConTrayectos = puntosData.map(punto => {
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
    
        if (error) {
            console.error("Error al consultar puntos de referencia:", error);
            return 0;
        }
    
        console.log(`Se encontraron ${data.length} puntos de referencia para el brigadista ${cedulaBrigadista}`);
        return data.length;
        } catch (err) {
        console.error("Error inesperado al verificar puntos:", err);
        return 0;
        }
};


