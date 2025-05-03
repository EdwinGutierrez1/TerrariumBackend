//Importamos los módulos de configuración para Firebase y Supabase 
const admin = require('../config/firebase.config');
const supabase = require('../config/supabase.config');

/**
 * Verifica un token de Firebase y obtiene datos adicionales del usuario desde Supabase
 * idToken - Token de ID de Firebase a verificar
 * Se retornan los datos del usuario (uid, email, nombre), o el error en caso de producirse.
*/

exports.verifyAndGetUserData = async (idToken) => {
  try {
    console.log("Iniciando verificación de token...");
    
    // Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token verificado para UID:", decodedToken.uid);
    
    const uid = decodedToken.uid;
    
    // Obtener datos adicionales del usuario desde Supabase
    // De la tabla brigadista, se selecciona el nombre, donde el campo "UID", concuerde con la constante uid previamente creada.
    console.log(`Consultando datos para UID ${uid} en Supabase...`);
    const {data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    // Manejar errores de la consulta a Supabase
    if (error) {
      console.error("Error en consulta a Supabase:", error);
      throw new Error('Error al consultar datos de usuario');
    }
    
    // Verificar si se encontraron datos del usuario, si no se obtuvieron se arroja un error.
    if (!data || data.length === 0) { 
      console.warn(`No se encontraron datos para UID ${uid}`);
      throw new Error('Usuario no encontrado en la base de datos');
    }
    
    console.log(`Datos de usuario obtenidos: ${JSON.stringify(data[0])}`); //imprime en la consola los datos del usuario obtenidos desde Supabase, convirtiéndolos en una cadena de texto JSON
    
    // Devolvemos un objeto con datos combinados de Firebase y Supabase
    return {
      uid: uid,
      email: decodedToken.email,
      nombre: data[0].nombre
    };
  } catch (error) {

    // Capturamos y relanzamos errores con un mensaje más descriptivo
    console.error("Error en servicio de autenticación:", error);
    throw new Error('Error de autenticación: ' + error.message);
  }
};


/**
 * Obtiene el nombre de un usuario por su UID desde Supabase
 * uid - UID del usuario a buscar
 * Devuelve el nombre del usuario o arroja un error si no se encuentra el usuario o hay errores en la consulta
 */

exports.getUserNameByUID = async (uid) => {
  console.log(`Buscando nombre para UID: ${uid}`);
  
  try {
    // Consulta el nombre en la tabla de brigadistas
    const { data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    // Maneja errores de la consulta
    if (error) {
      console.error("Error en consulta a Supabase:", error);
      throw new Error(error.message);
    }
    
    // Verifica si se encontró el usuario
    if (!data || data.length === 0) {
      console.warn(`No se encontró usuario con UID: ${uid}`);
      throw new Error('No se encontró el usuario');
    }
    
    console.log(`Nombre encontrado: ${data[0].nombre}`); //Si se encontró mostramos el nombre del usuario en la consola.
    return data[0].nombre;

  } catch (error) {
    // Capturar y relanzar errores
    console.error("Error al obtener nombre:", error);
    throw new Error('Error al obtener nombre de usuario: ' + error.message);
  }
};

/**
 * Maneja el cierre de sesión de un usuario. 
 * uid - UID del usuario que cierra sesión
 * retorna un booleano con el valor "true" si la operación tuvo éxito.
 */

exports.handleLogout = async (uid) => {
    console.log(`Procesando cierre de sesión para UID: ${uid}`);
    
    try {
      console.log(`Cierre de sesión procesado correctamente para UID: ${uid}`); //Si el cierre se hace correctamente, se indica a través de la consola.
      return true;
    } catch (error) { //Se manejan errores
      console.error("Error inesperado en handleLogout:", error);
      return true;
    }
};