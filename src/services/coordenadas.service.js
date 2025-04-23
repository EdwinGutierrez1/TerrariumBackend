// src/services/coordenadas.service.js
const supabase = require('../config/supabase.config');

// Servicio para obtener coordenadas según el conglomerado asociado al brigadista
exports.getCoordenadas = async (idConglomerado) => {
  try {
    console.log("⏳ Consultando coordenadas para conglomerado:", idConglomerado);
    
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
      console.warn("⚠️ No se encontraron coordenadas para el conglomerado:", idConglomerado);
      return [];
    }
    
    console.log(`✅ Se encontraron ${data.length} coordenadas para el conglomerado ${idConglomerado}`);
    return data;
  } catch (err) {
    console.error("🚨 Error inesperado en getCoordenadas:", err);
    return [];
  }
};