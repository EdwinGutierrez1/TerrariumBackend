// src/services/coordenadas.service.js
const supabase = require('../config/supabase.config');

// Servicio para obtener coordenadas según el conglomerado asociado al brigadista
exports.getCoordenadasSubparcelas = async (idConglomerado) => {
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

exports.getCentroPoblado = async (idConglomerado) => {
    try {
        console.log("⏳ Consultando centro poblado para conglomerado:", idConglomerado);
        
        if (!idConglomerado) {
        console.error("❌ Error: ID de conglomerado no proporcionado");
        return null;
        }
    
        // Consultamos el centro poblado para el conglomerado
        const { data, error } = await supabase
        .from("centro_poblado")
        .select("*")
        .eq("id_conglomerado", idConglomerado)
        .single(); // Usamos single() para obtener un solo registro
    
        if (error) {
        console.error("❌ Error al obtener centro poblado:", error);
        return null;
        }
    
        if (!data) {
        console.warn("⚠️ No se encontró centro poblado para el conglomerado:", idConglomerado);
        return null;
        }
        
        console.log(`✅ Se encontró centro poblado para el conglomerado ${idConglomerado}`);
        return data;
    } catch (err) {
        console.error("🚨 Error inesperado en getCentroPoblado:", err);
        return null;
    }
    }