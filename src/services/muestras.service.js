//LISTO
const supabase = require("../config/supabase.config"); // Se importa el módulo de configuración de Supabase

exports.obtenerSiguienteIdMuestra = async () => {
  try {

    // Realiza una consulta a la tabla muestra para obtener el último ID
    const { data, error } = await supabase
      .from("muestra")
      .select("id")
      .order("id", { ascending: false }) // Orden descendente para obtener el último ID
      .limit(1); // Limitamos a un registro para obtener SOLO el último ID

    if (error) { //Si ocurre un error en la consulta
      throw error;
    }

    if (data.length === 0) {
      // Si no hay muestras registradas en la tabla, el primer ID será M001
      return "M001";
    }

    // Obtener el último ID
    const ultimoId = data[0].id;

    // Extraer el número del ID (por ejemplo: M001 -> 1)
    // Primero eliminamos el prefijo "M" y luego convertimos la parte numérica a un número entero en base 10
    const numero = parseInt(ultimoId.replace("M", ""), 10);

    // Incrementamos el número en uno para generar el siguiente ID
    const siguienteNumero = numero + 1;

    // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
    // Luego lo concatenamos con el prefijo "M" para obtener el nuevo ID
    const siguienteId = `M${siguienteNumero.toString().padStart(3, "0")}`;

    // Devolvemos el nuevo ID generado, por ejemplo: "M002"
    return siguienteId;
  } catch (error) {
    //Si ocurre algún error en la función
    throw error;
  }
};

exports.almacenarMuestra = async (muestra) => {
  try {
    // Se crea un objeto con los campos necesarios para la base de datos, mapeando desde el objeto muestra original a la estructura esperada por la tabla
    const muestraData = {
      id: muestra.idMuestra,                      
      nombre_comun: muestra.nombreComun,          
      determinacion: muestra.determinacionCampo,  
      observaciones: muestra.observaciones,       
      num_coleccion: muestra.numeroColeccion,    
      id_arbol: muestra.arbol,                    
    };

    // Se ejecuta la operación de inserción en la tabla "muestra" de Supabase
    // y se solicita que devuelva el ID del registro insertado
    const { data, error } = await supabase
      .from("muestra")
      .insert(muestraData)
      .select("id");

    // Manejo de errores de la operación con Supabase
    if (error) {
      throw error; // Se propaga el error.
    }

    // Si todo sale bien, se retorna el ID de la muestra que fue insertada
    return data[0].id;
  } catch (error) {
    // Captura cualquier error que pueda ocurrir durante la ejecución
    throw error; // Se propaga el error.
  }
};