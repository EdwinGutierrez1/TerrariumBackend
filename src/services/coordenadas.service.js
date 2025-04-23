// src/services/coordenadas.service.js
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

    console.log(
      `✅ Se encontraron ${data.length} coordenadas para el conglomerado ${idConglomerado}`
    );
    return data;
  } catch (err) {
    console.error("🚨 Error inesperado en getCoordenadas:", err);
    return [];
  }
};

exports.getCentroPoblado = async (brigada) => {
  try {
    console.log(
      "⏳ Consultando centro poblado para conglomerado:",
      idConglomerado
    );

    if (!idConglomerado) {
      console.error("❌ Error: ID de conglomerado no proporcionado");
      return null;
    }

    const { data: brigadistas, error: errorBrigadistas } = await supabase
      .from("brigadista")
      .select("cedula")
      .in("id_brigada", brigada);

    if (errorBrigadistas) {
      console.error("Error en consulta de brigadistas:", errorBrigadistas);
      throw errorBrigadistas;
    }

    console.log("Brigadistas encontrados:", brigadistas);
    const cedulas = brigadistas.map((b) => b.cedula);

    if (cedulas.length === 0) {
      console.log("No se encontraron cédulas de brigadistas");
      return [];
    }

    console.log("Consultando puntos con cedulas:", cedulas);
    const { data: centros, error: errorCentros } = await supabase
      .from("punto_referencia")
      .select("latitud, longitud, descripcion, tipo")
      .eq("tipo", "Centro Poblado")
      .in("cedula_brigadista", cedulas);

    if (errorCentros) {
      console.error("Error en consulta de centros poblados:", errorCentros);
      throw errorCentros;
    }

    if (!data) {
      console.warn(
        "⚠️ No se encontró centro poblado para el conglomerado:",
        idConglomerado
      );
      return null;
    }

    console.log("Centros poblados encontrados:", centros);
    console.log(`✅ Se encontró centro poblado: ${centros}`);

    const centrosFormateados = centros
      .map((centro) => {
        try {
          // Asegúrate de que cualquier formato de string se convierta correctamente
          // a un número válido, incluso si contiene caracteres no numéricos
          let lat = centro.latitud;
          let lng = centro.longitud;

          // Si son strings, intenta limpiarlos y convertirlos
          if (typeof lat === "string") {
            lat = parseFloat(lat.replace(/[^\d.-]/g, ""));
          }
          if (typeof lng === "string") {
            lng = parseFloat(lng.replace(/[^\d.-]/g, ""));
          }

          // Verificación adicional para coordenadas inválidas
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn("Coordenadas inválidas encontradas:", centro);
            return null; // Omitir este centro
          }

          // Verificar rangos válidos para coordenadas (latitud: -90 a 90, longitud: -180 a 180)
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn("Coordenadas fuera de rango:", { lat, lng });
            return null; // Omitir este centro
          }

          return {
            ...centro,
            latitud: lat,
            longitud: lng,
          };
        } catch (error) {
          console.error("Error procesando coordenadas:", error, centro);
          return null;
        }
      })
      .filter(Boolean); // Eliminar entradas nulas

    console.log("Centros formateados para devolver:", centrosFormateados);
    return centrosFormateados;
    
  } catch (err) {
    console.error("🚨 Error inesperado en getCentroPoblado:", err);
    return null;
  }
};
