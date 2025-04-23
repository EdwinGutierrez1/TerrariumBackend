const supabase = require("../config/supabase.config");

// Servicio para obtener coordenadas según el conglomerado asociado al brigadista
exports.getCoordenadasSubparcelas = async (idConglomerado) => {
  try {
    console.log(
      "⏳ Consultando coordenadas para conglomerado:",
      idConglomerado
    );

    if (!idConglomerado) {
      console.error("❌ Error: ID de conglomerado no proporcionado");
      return [];
    }

    // Consultamos las coordenadas para el conglomerado
    const { data, error } = await supabase
      .from("subparcela")
      .select("*")
      .eq("id_conglomerado", idConglomerado);

    if (error) {
      console.error("❌ Error al obtener coordenadas:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn(
        "⚠️ No se encontraron coordenadas para el conglomerado:",
        idConglomerado
      );
      return [];
    }

    // Procesamos las coordenadas para asegurar que sean valores numéricos válidos
    const coordenadasFormateadas = data.map(coord => {
      // Convertir latitud y longitud a números
      let lat = typeof coord.latitud === "string" ? parseFloat(coord.latitud.replace(/[^\d.-]/g, "")) : coord.latitud;
      let lng = typeof coord.longitud === "string" ? parseFloat(coord.longitud.replace(/[^\d.-]/g, "")) : coord.longitud;
      
      // Verificar que sean números válidos dentro del rango
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn("Coordenadas inválidas encontradas:", coord);
        return null;
      }
      
      // Verificar rangos válidos
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn("Coordenadas fuera de rango:", { lat, lng });
        return null;
      }
      
      return {
        ...coord,
        latitud: lat,
        longitud: lng,
      };
    }).filter(Boolean); // Eliminar entradas nulas

    console.log(
      `✅ Se encontraron ${coordenadasFormateadas.length} coordenadas válidas para el conglomerado ${idConglomerado}`
    );
    return coordenadasFormateadas;
  } catch (err) {
    console.error("🚨 Error inesperado en getCoordenadas:", err);
    return [];
  }
};

exports.getCentroPoblado = async (brigada) => {
  try {
    console.log(
      "⏳ Consultando centro poblado para brigada:",
      brigada
    );

    if (!brigada) {
      console.error("❌ Error: ID de brigada no proporcionado");
      return []; 
    }

    // Primero obtenemos los brigadistas asociados a esta brigada
    const { data: brigadistas, error: errorBrigadistas } = await supabase
      .from("brigadista")
      .select("cedula")
      .eq("id_brigada", brigada);

    if (errorBrigadistas) {
      console.error("Error en consulta de brigadistas:", errorBrigadistas);
      return [];
    }

    console.log("Brigadistas encontrados:", brigadistas);
    
    if (!brigadistas || brigadistas.length === 0) {
      console.log("No se encontraron brigadistas para esta brigada");
      return [];
    }
    
    const cedulas = brigadistas.map((b) => b.cedula);

    // Consultamos los puntos de referencia tipo "Centro Poblado" asociados a esos brigadistas
    console.log("Consultando puntos con cedulas:", cedulas);
    const { data: centros, error: errorCentros } = await supabase
      .from("punto_referencia")
      .select("latitud, longitud, descripcion, tipo")
      .eq("tipo", "Centro Poblado")
      .in("cedula_brigadista", cedulas);

    if (errorCentros) {
      console.error("Error en consulta de centros poblados:", errorCentros);
      return [];
    }

    if (!centros || centros.length === 0) {
      console.warn(
        "⚠️ No se encontraron centros poblados para la brigada:",
        brigada
      );
      return [];
    }

    console.log("Centros poblados encontrados:", centros);

    // Formateamos las coordenadas para asegurar que sean números válidos
    const centrosFormateados = centros
      .map((centro) => {
        try {
          // Convertir a números eliminando caracteres no numéricos
          let lat = typeof centro.latitud === "string" 
            ? parseFloat(centro.latitud.replace(/[^\d.-]/g, "")) 
            : parseFloat(centro.latitud);
          
          let lng = typeof centro.longitud === "string" 
            ? parseFloat(centro.longitud.replace(/[^\d.-]/g, "")) 
            : parseFloat(centro.longitud);

          // Verificar que los valores sean números válidos
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn("Coordenadas inválidas encontradas:", centro);
            return null;
          }

          // Verificar rangos válidos para coordenadas
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn("Coordenadas fuera de rango:", { lat, lng });
            return null;
          }

          // Devolver objeto con coordenadas formateadas
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
      .filter(Boolean); // Eliminar entradas nulas

    console.log(`✅ Se encontraron ${centrosFormateados.length} centros poblados válidos`);
    console.log("Centros formateados para devolver:", centrosFormateados);
    return centrosFormateados;
    
  } catch (err) {
    console.error("🚨 Error inesperado en getCentroPoblado:", err);
    return [];
  }
};