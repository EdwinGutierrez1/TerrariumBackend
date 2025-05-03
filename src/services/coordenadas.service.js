
//Servicio para la gestión de coordenadas geográficas. provee funcionalidades para obtener las coordenadas de las subparcelas y centros poblados.

const supabase = require("../config/supabase.config"); //Se importa el modulo de configuración para supabase.


/**
 * Obtiene las coordenadas de las subparcelas asociadas a un conglomerado específico
 * idConglomerado - Identificador único del conglomerado
 * retorna un array de objetos con las coordenadas de las subparcelas formateadas.
 */

exports.getCoordenadasSubparcelas = async (idConglomerado) => {
  try {
    console.log(
      "⏳ Consultando coordenadas para conglomerado:",
      idConglomerado
    );

    // Validación inicial del parámetro de entrada
    if (!idConglomerado) {
      console.error("Error: ID de conglomerado no proporcionado");
      return [];
    }

    // Consulta a la base de datos para obtener las subparcelas del conglomerado
    const { data, error } = await supabase
      .from("subparcela")
      .select("*")
      .eq("id_conglomerado", idConglomerado);

    // Manejo de errores en la consulta
    if (error) {
      console.error("❌ Error al obtener coordenadas:", error);
      return [];
    }

    // Verificación de que existan datos
    if (!data || data.length === 0) {
      console.warn(
        "⚠️ No se encontraron coordenadas para el conglomerado:",
        idConglomerado
      );
      return [];
    }

    // Procesamiento y validación de coordenadas para asegurar valores numéricos correctos

    const coordenadasFormateadas = data.map(coord => {
      // Conversión de cadenas a números, eliminando caracteres no numéricos
      let lat = typeof coord.latitud === "string" ? parseFloat(coord.latitud.replace(/[^\d.-]/g, "")) : coord.latitud;
      let lng = typeof coord.longitud === "string" ? parseFloat(coord.longitud.replace(/[^\d.-]/g, "")) : coord.longitud;
      
      // Validación de que sean números y no valores no numéricos o infinitos
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn("Coordenadas inválidas encontradas:", coord);
        return null;
      }
      
      // Validación de que estén dentro de los rangos geográficos válidos
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn("Coordenadas fuera de rango:", { lat, lng });
        return null;
      }
      
      // Retorno del objeto con las coordenadas formateadas
      return {
        ...coord,
        latitud: lat,
        longitud: lng,
      };
    }).filter(Boolean); // Eliminación de entradas nulas (coordenadas inválidas)

    console.log(
      `✅ Se encontraron ${coordenadasFormateadas.length} coordenadas válidas para el conglomerado ${idConglomerado}`
    );
    return coordenadasFormateadas;
  } catch (err) {
    console.error("🚨 Error inesperado en getCoordenadas:", err);
    return [];
  }
};

/**
 * Obtiene los centros poblados asociados a los brigadistas de una brigada específica
 * brigada - Identificador único de la brigada
 * devuelve un array de objetos con las coordenadas de los centros poblados
 */

exports.getCentroPoblado = async (brigada) => {
  try {
    console.log(
      "⏳ Consultando centro poblado para brigada:",
      brigada
    );

    // Validación del parámetro de entrada
    if (!brigada) {
      console.error("❌ Error: ID de brigada no proporcionado");
      return []; 
    }

    // Primer paso: Obtener las cedulas de los brigadistas asociados a la brigada especificada
    const { data: brigadistas, error: errorBrigadistas } = await supabase
      .from("brigadista")
      .select("cedula")
      .eq("id_brigada", brigada);

    if (errorBrigadistas) { //Si se produjo error en la consulta
      console.error("Error en consulta de brigadistas:", errorBrigadistas);
      return [];
    }

    console.log("Brigadistas encontrados:", brigadistas);
    
    if (!brigadistas || brigadistas.length === 0) { //Si no se encontrarno brigadistas.
      console.log("No se encontraron brigadistas para esta brigada");
      return [];
    }
    
    // Extracción de las cédulas de los brigadistas para la siguiente consulta. 
    // Esto es necesario porque el resultado de la consulta anterior es un array de objetos y lo que se necesita para la siguiente consulta es un array simple de valores de cédulas.
    const cedulas = brigadistas.map((b) => b.cedula);

    // Segundo paso: Consultar los puntos de referencia tipo "Centro Poblado" asociados a los brigadistas

    console.log("Consultando puntos con cedulas:", cedulas);

    const { data: centros, error: errorCentros } = await supabase
      .from("punto_referencia")
      .select("latitud, longitud, descripcion, tipo")
      .eq("tipo", "Centro Poblado")
      .in("cedula_brigadista", cedulas);

    if (errorCentros) { //Si se produce un error
      console.error("Error en consulta de centros poblados:", errorCentros);
      return [];
    }

    if (!centros || centros.length === 0) { //Si no se encuentran
      console.warn(
        "⚠️ No se encontraron centros poblados para la brigada:",
        brigada
      );
      return [];
    }

    console.log("Centros poblados encontrados:", centros);

    // Procesamiento y validación de coordenadas para asegurar que sean números válidos
    const centrosFormateados = centros
      .map((centro) => {
        try {

          // Conversión de cadenas a números, eliminando caracteres no numéricos
          let lat = typeof centro.latitud === "string" 
            ? parseFloat(centro.latitud.replace(/[^\d.-]/g, "")) 
            : parseFloat(centro.latitud);
          
          let lng = typeof centro.longitud === "string" 
            ? parseFloat(centro.longitud.replace(/[^\d.-]/g, "")) 
            : parseFloat(centro.longitud);

          // Validación de que sean números y no valores NaN o infinitos
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn("Coordenadas inválidas encontradas:", centro);
            return null;
          }

          // Validación de rangos geográficos válidos
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn("Coordenadas fuera de rango:", { lat, lng });
            return null;
          }

          // Retorno del objeto con las coordenadas formateadas y datos adicionales
          return {
            ...centro,
            latitud: lat,
            longitud: lng,
            descripcion: centro.descripcion || "Centro Poblado",
            tipo: centro.tipo
          };
        } catch (error) {
          console.error("Error procesando coordenadas:", error, centro);
          return null;
        }
      })
      .filter(Boolean); // Eliminación de entradas nulas (coordenadas inválidas)

    console.log(`Se encontraron ${centrosFormateados.length} centros poblados válidos`);
    console.log("Centros formateados para devolver:", centrosFormateados);
    return centrosFormateados;
    
  } catch (err) { //Si se produjo un error.
    console.error("Error inesperado en getCentroPoblado:", err);
    return [];
  }
};