const supabase = require('../config/supabase.config'); //Importamos el modulo de configuración para supabase. Es necesario ya que en este archivo realizamos consultas en la BD.

// Se obtiene la información del brigadista autenticado
exports.getInfoBrigadista = async (uid) => {
  try {
    // Consulta a la tabla brigadista
    const { data, error } = await supabase
      .from("brigadista")
      .select("nombre, id_brigada, rol, cedula, tutorial_completado")
      .eq("UID", uid);

    if (error || !data || data.length === 0) {
      console.error("Error o brigadista no encontrado:", error);
      return null;
    }

    const brigadista = data[0];

    // Consultamos la tabla brigada para obtener el id_conglomerado asociado
    const { data: brigadaData, error: brigadaError } = await supabase
      .from("brigada")
      .select("id_conglomerado")
      .eq("id", brigadista.id_brigada)
      .single();

    if (brigadaError) {
      console.error("Error al obtener el conglomerado:", brigadaError);
      return null;
    }

    // Retornamos un objeto con toda la información combinada
    return {
      nombre: brigadista.nombre,
      brigada: brigadista.id_brigada,
      rol: brigadista.rol,
      cedula: brigadista.cedula,
      idConglomerado: brigadaData.id_conglomerado,
      tutorial_completado: brigadista.tutorial_completado
    };
  } catch (err) { //Si se produce un error
    console.error("Error inesperado en getInfoBrigadista:", err);
    return null;
  }
};


// Para actualizar el campo "tutorial_completado"
exports.updateTutorialCompletado = async (uid, completado) => {
  try {
    console.log("Iniciando actualización de tutorial...");

    // Obtenemos la brigada y el rol del usuario autenticado
    const { data: brigadistaData, error: brigadistaError } = await supabase
      .from('brigadista')
      .select('id_brigada, rol')
      .eq("UID", uid)
      .single();

    //Si se obtuvo un error
    if (brigadistaError) {
      console.error("Error al obtener información del brigadista:", brigadistaError);
      throw brigadistaError;
    }

    const idBrigada = brigadistaData.id_brigada;
    const rol = brigadistaData.rol;

    // Si NO es jefe de brigada, solo actualiza su propio tutorial
    if (rol !== "Jefe de Brigada" && completado === true) {
      console.warn("Solo el Jefe de brigada puede completar el tutorial para todos");

      const { data, error } = await supabase
        .from('brigadista')
        .update({ tutorial_completado: completado })
        .eq("UID", uid);

      if (error) {
        console.error("Error al actualizar el tutorial para el usuario:", error);
        throw error;
      }

      return { updated: 'single', data };
    }

    // Si es jefe, actualiza el campo tutorial para toda su brigada
    const { data, error } = await supabase
      .from('brigadista')
      .update({ tutorial_completado: completado })
      .eq("id_brigada", idBrigada)
      .select();

    if (error) {
      console.error("Error al hacer el update en Supabase para la brigada:", error);
      throw error;
    }

    console.log(`Tutorial actualizado para la brigada ${idBrigada}`);
    return { updated: 'brigade', data };

  } catch (error) { //Si se produce algún error.
    console.error("Error en updateTutorialCompletado:", error);
    throw error;
  }
};
