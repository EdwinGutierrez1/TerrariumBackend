const admin = require('../config/firebase.config');
const supabase = require('../config/supabase.config');

// Verificar token de Firebase y obtener datos de usuario
exports.verifyAndGetUserData = async (idToken) => {
  try {
    console.log("Iniciando verificación de token...");
    
    // Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token verificado para UID:", decodedToken.uid);
    
    const uid = decodedToken.uid;
    
    // Obtener datos adicionales del usuario desde Supabase
    console.log(`Consultando datos para UID ${uid} en Supabase...`);
    const { data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    if (error) {
      console.error("Error en consulta a Supabase:", error);
      throw new Error('Error al consultar datos de usuario');
    }
    
    if (!data || data.length === 0) {
      console.warn(`No se encontraron datos para UID ${uid}`);
      throw new Error('Usuario no encontrado en la base de datos');
    }
    
    console.log(`Datos de usuario obtenidos: ${JSON.stringify(data[0])}`);
    
    return {
      uid: uid,
      email: decodedToken.email,
      nombre: data[0].nombre
    };
  } catch (error) {
    console.error("Error en servicio de autenticación:", error);
    throw new Error('Error de autenticación: ' + error.message);
  }
};

// Obtener nombre de usuario por UID
exports.getUserNameByUID = async (uid) => {
  console.log(`Buscando nombre para UID: ${uid}`);
  
  try {
    const { data, error } = await supabase
      .from('brigadista')
      .select('nombre')
      .eq('UID', uid);
    
    if (error) {
      console.error("Error en consulta a Supabase:", error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      console.warn(`No se encontró usuario con UID: ${uid}`);
      throw new Error('No se encontró el usuario');
    }
    
    console.log(`Nombre encontrado: ${data[0].nombre}`);
    return data[0].nombre;
  } catch (error) {
    console.error("Error al obtener nombre:", error);
    throw new Error('Error al obtener nombre de usuario: ' + error.message);
  }
};

// Nueva función para manejar el cierre de sesión
exports.handleLogout = async (uid) => {
    console.log(`Procesando cierre de sesión para UID: ${uid}`);
    
    try {
      // Aquí puedes agregar cualquier lógica necesaria para el cierre de sesión
      // Por ahora, solo registramos el evento
      
      console.log(`Cierre de sesión procesado correctamente para UID: ${uid}`);
      return true;
    } catch (error) {
      console.error("Error inesperado en handleLogout:", error);
      return true;
    }
  };