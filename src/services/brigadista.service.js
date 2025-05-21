//LISTO
const supabase = require('../config/supabase.config'); //Importamos el modulo de configuración para supabase. Es necesario ya que en este archivo realizamos operaciones en la Base de datos.

// Se obtiene la información del brigadista autenticado
exports.getInfoBrigadista = async (uid) => {
  try {
    // Consulta a la tabla brigadista
    const { data, error } = await supabase
      .from("brigadista")
      .select("nombre, id_brigada, rol, cedula, tutorial_completado") //Seleccionamos los datos pertinentes
      .eq("UID", uid); //El valor del campo UID, debe coincidir con el valor de la constante uid, pasada como parámetro.

    if (error || !data || data.length === 0) { //Si se produjo un error o no se encontró ningún usuario.
      return null;
    }

    const brigadista = data[0]; //Se obtiene el primer elemento del array "data", que es el único elemento que debería existir.

    // Consultamos la tabla brigada para obtener el id_conglomerado asociado
    const { data: brigadaData, error: brigadaError } = await supabase
      .from("brigada")
      .select("id_conglomerado")
      .eq("id", brigadista.id_brigada)  //El valor del campo id, debe coincidir con el id_brigada del brigadista.
      .single(); //Se utiliza el método single(), para indicar que solo se espera un resultado.

    if (brigadaError) { //Si se produjo un error al hacer la consulta
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
    return null;
  }
};


// Para actualizar el campo "tutorial_completado"
exports.updateTutorialCompletado = async (uid, completado) => {
  try {

    // Obtenemos la brigada y el rol del usuario autenticado
    const { data: brigadistaData, error: brigadistaError } = await supabase
      .from('brigadista')
      .select('id_brigada, rol')
      .eq("UID", uid)
      .single();

    //Si se obtuvo un error
    if (brigadistaError) {
      throw brigadistaError;
    }

    const idBrigada = brigadistaData.id_brigada;
    const rol = brigadistaData.rol;

    // Si NO es jefe de brigada, solo actualiza su propio tutorial
    /* Esta es una validación que se hace en caso de que algún usuario que no es jefe de brigada, por alguna razón lograra "acceder" al tutorial
    aunque no es algo que debería suceder.*/

    if (rol !== "Jefe de Brigada" && completado === true) {

      const { data, error } = await supabase
        .from('brigadista')
        .update({ tutorial_completado: completado })
        .eq("UID", uid);

      if (error) { //Si se produjo un error
        throw error;
      }

      return { updated: 'single', data }; //Se retorna el objeto con los datos actualizados.
    }

    // Si es jefe, actualiza el campo tutorial para toda su brigada.
    const { data, error } = await supabase
      .from('brigadista')
      .update({ tutorial_completado: completado })
      .eq("id_brigada", idBrigada)
      .select(); //Se selecciona todos los datos.

    if (error) { //Si se produjo un error
      throw error;
    }

    return { updated: 'brigade', data }; //Se retorna el objeto con los datos actualizados.

  } catch (error) { //Si se produce algún error.
    throw error;
  }
};
