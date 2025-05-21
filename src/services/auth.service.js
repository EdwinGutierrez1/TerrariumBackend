//LISTO
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
    
    // Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    const uid = decodedToken.uid;
    
    // Obtener datos adicionales del usuario desde Supabase
    // De la tabla brigadista, se selecciona el nombre, donde el campo "UID", concuerde con la constante uid previamente creada.
    const {data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    // Manejar errores de la consulta a Supabase
    if (error) {
      throw new Error('Error al consultar datos de usuario');
    }
    
    // Verificar si se encontraron datos del usuario, si no se obtuvieron se arroja un error.
    if (!data || data.length === 0) { 
      throw new Error('Usuario no encontrado en la base de datos');
    }
    
    
    // Devolvemos un objeto con datos combinados de Firebase y Supabase
    return {
      uid: uid,
      email: decodedToken.email,
      nombre: data[0].nombre
    };
  } catch (error) {

    // Capturamos y relanzamos errores con un mensaje más descriptivo
    throw new Error('Error de autenticación: ' + error.message);
  }
};


/**
 * Obtiene el nombre de un usuario por su UID desde Supabase
 * uid - UID del usuario a buscar
 * Devuelve el nombre del usuario o arroja un error si no se encuentra el usuario o hay errores en la consulta
 */

exports.getUserNameByUID = async (uid) => {
  
  try {
    // Consulta el nombre en la tabla de brigadistas
    const { data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    // Maneja errores de la consulta
    if (error) {
      throw new Error(error.message);
    }
    
    // Verifica si se encontró el usuario
    if (!data || data.length === 0) {
      throw new Error('No se encontró el usuario');
    }
    
    return data[0].nombre; //Retorna el nombre del usuario

  } catch (error) {
    // Capturar y relanzar errores
    throw new Error('Error al obtener nombre de usuario: ' + error.message);
  }
};

/**
 * Maneja el cierre de sesión de un usuario. 
 * uid - UID del usuario que cierra sesión
 * retorna un booleano con el valor "true" si la operación tuvo éxito.
 */

exports.handleLogout = async (uid) => {
    try {
      return true;
    } catch (error) { //Se manejan errores
      return true;
    }
};