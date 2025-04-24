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