/*Ambas funciones están relacionadas con la misma entidad "Brigadista". Por eso conviene mantenerlas en un mismo archivo */

const supabase = require('../config/supabase.config');

// Servicio para obtener información del brigadista
exports.getInfoBrigadista = async (uid) => {
  try {
    // Consulta la tabla "Brigadista"
    const { data, error } = await supabase
      .from("brigadista")
      .select("nombre, id_brigada, rol, cedula, tutorial_completado")
      .eq("UID", uid);

    if (error) {
      console.error("Error al obtener el brigadista:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error("No se encontró ningún brigadista con UID:", uid);
      return null;
    }
    
    const brigadista = data[0];

    // Consulta a la tabla Brigada para obtener el idConglomerado
    const { data: brigadaData, error: brigadaError } = await supabase
      .from("brigada")
      .select("id_conglomerado")
      .eq("id", brigadista.id_brigada)
      .single();
    
    if (brigadaError) {
      console.error("Error al obtener el conglomerado:", brigadaError);
      return null;
    }
    
    return {
      nombre: brigadista.nombre,
      brigada: brigadista.id_brigada,
      rol: brigadista.rol,
      cedula: brigadista.cedula,
      idConglomerado: brigadaData.id_conglomerado,
      tutorial_completado: brigadista.tutorial_completado
    };
  } catch (err) {
    console.error("Error inesperado en getInfoBrigadista:", err);
    return null;
  }
};

// Servicio para actualizar el estado del tutorial
exports.updateTutorialCompletado = async (uid, completado) => {
  try {
    console.log("⏳ Iniciando actualización de tutorial...");

    // 1. Primero obtenemos la información del brigadista actual para conocer su brigada
    const { data: brigadistaData, error: brigadistaError } = await supabase
      .from('brigadista')
      .select('id_brigada, rol')
      .eq("UID", uid)
      .single();

    if (brigadistaError) {
      console.error("❌ Error al obtener información del brigadista:", brigadistaError);
      throw brigadistaError;
    }

    const idBrigada = brigadistaData.id_brigada;
    const rol = brigadistaData.rol;

    console.log("👥 ID de brigada del usuario:", idBrigada);
    console.log("👤 Rol del usuario:", rol);

    // Verificar que el usuario sea Jefe de brigada
    if (rol !== "Jefe de Brigada" && completado === true) {
      console.warn("⚠️ Solo el Jefe de brigada puede completar el tutorial para toda la brigada");
      
      // Actualizar solo el usuario actual
      const { data, error } = await supabase
        .from('brigadista')
        .update({ tutorial_completado: completado })
        .eq("UID", uid);

      if (error) {
        console.error("❌ Error al actualizar el tutorial para el usuario:", error);
        throw error;
      }
      
      return { updated: 'single', data };
    }

    console.log("📤 Enviando update a Supabase para toda la brigada...");
    console.log("📝 Valor a actualizar:", completado);

    // 2. Actualizamos el tutorial_completado para todos los miembros de la brigada
    const { data, error } = await supabase
      .from('brigadista')
      .update({ tutorial_completado: completado })
      .eq("id_brigada", idBrigada)
      .select();

    if (error) {
      console.error("❌ Error al hacer el update en Supabase para la brigada:", error);
      throw error;
    }

    console.log(`✅ Tutorial actualizado exitosamente para todos los miembros de la brigada ${idBrigada}`);
    return { updated: 'brigade', data };
  } catch (error) {
    console.error("🚨 Error en updateTutorialCompletado:", error);
    throw error;
  }
};