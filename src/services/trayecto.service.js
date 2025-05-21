//LISTO
const supabase = require('../config/supabase.config'); // Se importa la configuración de conexión a Supabase 

/**
 * Genera el siguiente ID secuencial para un nuevo trayecto
 * Los IDs siguen el formato 'TR' seguido de un número de 3 dígitos (ej: TR001, TR002...)
 * retorna el siguiente ID disponible.
 */

const obtenerSiguienteIdTrayecto = async () => {
    try {
      // Realizamos una consulta para obtener el último ID de trayecto
      const { data, error } = await supabase
        .from('trayecto')
        .select('id')
        .order('id', { ascending: false })  // Ordenamos en orden descendente para obtener el último ID
        .limit(1);  // Tomamos solo el último
  
      if (error) {
        return null;  // Si ocurre un error, retornamos null
      }
  
      if (data.length === 0) {
        // Si no hay trayectos en la base de datos, el primer ID será 'TR001'
        return 'TR001';
      }
  
      // Obtener el último ID de trayecto
      const ultimoId = data[0].id;
  
      // Extraer el número del ID (ejemplo: 'TR001' -> 1)
      const numero = parseInt(ultimoId.replace('TR', ''), 10);
  
      // Generar el siguiente número para el ID
      const siguienteNumero = numero + 1;
      
      // Formatear el número con ceros a la izquierda para mantener 3 dígitos
      const siguienteId = `TR${siguienteNumero.toString().padStart(3, '0')}`;
  
      return siguienteId; //Se retorna el siguiente ID de trayecto
    } catch (error) {
      return null;  // Si ocurre un error, retornamos null
    }
  };
  
/**
 * Inserta un nuevo trayecto en la base de datos
 * retorna el resultado de la operación con los datos insertados o arroja un error si se presenta.
 */

const insertarTrayecto = async (trayecto, idReferencia) => {
    try {
      // Obtiene el siguiente ID disponible, haciendo uso de la función definida anteriormente
      const siguienteId = await obtenerSiguienteIdTrayecto();
      
      if (!siguienteId) { //Si no se obtuvo el id
        throw new Error("No se pudo generar el siguiente ID para el trayecto");
      }
  
      // Destructura los datos relevantes del objeto trayecto
      const { medioTransporte, duracion, distancia } = trayecto;
  
      // Validación del medio de transporte
      if (!medioTransporte || medioTransporte.trim() === "") {
        throw new Error("El campo 'medio_transporte' no puede estar vacío");
      }
  
      // Inserta el trayecto en la base de datos
      const { error, data } = await supabase
        .from('trayecto')
        .insert([
          {
            id: siguienteId,          
            medio_transporte: medioTransporte,
            duracion,
            distancia,
            id_punto_referencia: idReferencia,
          },
        ])
        .select(); // Selecciona los datos insertados para devolverlos
  
      if (error) throw error; //Si se produce error
  
      return { success: true, data: { id: siguienteId, ...data[0] } }; //Se retorna el resultado de la operación
    } catch (error) { //manejo de errores
      throw error;
    }
  };

/**
 * Actualiza un trayecto existente en la base de datos
 * retorna el resultado de la operación con los datos insertados o arroja un error si se presenta.
 */

const actualizarTrayecto = async (trayecto, referenciaId) => {
    try {
      // Destructura los datos relevantes del objeto trayecto
      const { medioTransporte, duracion, distancia } = trayecto;
  
      // Validación del medio de transporte
      if (!medioTransporte || medioTransporte.trim() === "") {
        throw new Error("El campo 'medio_transporte' no puede estar vacío");
      }
  
      // Actualiza el trayecto en la base de datos
      const { data, error } = await supabase
        .from("trayecto")
        .update({
          medio_transporte: medioTransporte,
          duracion,
          distancia,
        })
        .eq("id_punto_referencia", referenciaId); // Filtra por el punto de referencia
  
      if (error) throw error; //Si se produce error
  
      return { success: true, data }; //Se retorna el resultado de la operación
    } catch (err) { //Manejo de errores
      throw err;
    }
  };

  
/**
 * Busca un trayecto por su ID en la base de datos
 * retorna los datos del trayecto encontrado o null si no existe
 */

const obtenerTrayectoPorId = async (id) => {
    try {
      // Consulta el trayecto por su ID
      const { data, error } = await supabase
        .from('trayecto')
        .select('*')
        .eq('id', id)
        .single(); // Espera un solo resultado
      
      if (error) {
        // Si el error es porque no encontró resultados, retornamos null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data; //Retornamos el trayecto encontrado
    } catch (error) { //Manejo de errores
      throw error;
    }
  };

// Exportamos las funciones del servicio para ser utilizadas por el controlador
// En este caso la exportación de las funciones se hace se hace al final del archivo, en lugar de exportar cada función al definilarla, cualquiera de las dos formas es válida.
module.exports = {
    obtenerSiguienteIdTrayecto,
    insertarTrayecto,
    actualizarTrayecto,
    obtenerTrayectoPorId
};