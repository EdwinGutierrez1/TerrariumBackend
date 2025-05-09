const supabase = require("../config/supabase.config");

exports.obtenerSiguienteIdMuestra = async () => {
  try {
    // Realiza una consulta a la tabla punto_referencia para obtener el último ID
    const { data, error } = await supabase
      .from("muestra")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error al obtener el último ID:", error);
      throw error;
    }

    if (data.length === 0) {
      // Si no hay puntos en la tabla, el primer ID será PR001
      return "M001";
    }

    // Obtener el último ID
    const ultimoId = data[0].id;

    // Extraer el número del ID (por ejemplo: PR001 -> 1)
    // Primero eliminamos el prefijo "PR" y luego convertimos la parte numérica a un número entero en base 10
    const numero = parseInt(ultimoId.replace("M", ""), 10);

    // Incrementamos el número en uno para generar el siguiente ID
    const siguienteNumero = numero + 1;

    // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
    // Luego lo concatenamos con el prefijo "PR" para obtener el nuevo ID
    const siguienteId = `M${siguienteNumero.toString().padStart(3, "0")}`;

    // Devolvemos el nuevo ID generado, por ejemplo: "PR002"
    return siguienteId;
  } catch (error) {
    //Si ocurre algún error en la función
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
};

exports.almacenarMuestra = async (muestra) => {
  try {
    const muestraData = {
      id: muestra.idMuestra,
      tamaño_individuo: muestra.tamanoIndividuo,
      nombre_comun: muestra.nombreComun,
      determinacion: muestra.determinacionCampo,
      observaciones: muestra.observaciones,
      num_coleccion: muestra.numeroColeccion,
      id_arbol: muestra.arbol,
      cedula_brigadista: muestra.cedula_brigadista,
    };

    // Almacena la muestra en la base de datos
    const { data, error } = await supabase
      .from("muestra")
      .insert(muestraData)
      .select("id");

    if (error) {
      console.error("Error al almacenar la muestra:", error);
      throw error;
    }

    return data[0].id; // Devuelve el ID de la muestra almacenada
  } catch (error) {
    //Si ocurre un error en la ejecución de la función
    console.error("Error al insertar muestra:", error);
    throw error;
  }
};
