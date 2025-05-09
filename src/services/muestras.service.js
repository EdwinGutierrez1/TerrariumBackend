const supabase = require("../config/supabase.config");

exports.getUltimoIdMuestra = async () => {
  try {
    console.log("⏳ Consultando el último ID de muestra");

    // Consulta a la base de datos para obtener el último ID de muestra
    const { data, error } = await supabase
      .from("muestra")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    // Manejo de errores en la consulta
    if (error) {
      console.error("❌ Error al obtener el último ID de muestra:", error);
      return null;
    }

    // Verificación de que existan datos
    if (!data) {
      console.warn("⚠️ No se encontraron muestras en la base de datos");
      return null;
    }else if (data.length === 0) {
      return 0; // Si no hay muestras, retornamos 0
    }

    // Retorno del último ID de muestra encontrado
    return data[0].id;
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return null;
  }
}