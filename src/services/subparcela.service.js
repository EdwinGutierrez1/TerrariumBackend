//LISTO
const supabase = require("../config/supabase.config"); // Importamos la configuración de conexión a Supabase

/**
 * Obtiene el último número de cobertura registrado para generar IDs secuenciales
 * retorna el número de la última cobertura o 0 si no hay registros
 */

exports.getLastCoberturaNumber = async () => {
  // Consulta la última cobertura ordenada por ID de forma descendente
  const { data, error } = await supabase
    .from("cobertura")
    .select("id")
    .order("id", { ascending: false })
    .limit(1); // Solo un resultado esperado

  if (error) throw error; //Si se produce un error.

  // Extrae el número del ID (ej: de "C001" obtiene 1)
  if (data && data.length > 0) {
    const lastId = data[0].id;
    return parseInt(lastId.substring(1), 10); // Quita la "C" inicial y convierte a entero
  } else {
    return 0; // Si no hay registros
  }
};

/**
 * Inserta múltiples coberturas asociadas a una subparcela en la base de datos
 * coberturas - Lista de objetos de cobertura con tipo y porcentaje
 * idSubparcela - ID de la subparcela a la que se asociarán las coberturas
 * devuelve un array de las coberturas insertadas con sus IDs generados
 */

exports.insertCoberturas = async (coberturas, idSubparcela) => {
  try {
    const coberturasData = [];
    // Obtiene el último número para generar IDs secuenciales
    let lastNumber = await this.getLastCoberturaNumber();

    // Prepara los datos para inserción, asignando IDs con formato "C001", "C002", etc.
    for (const cobertura of coberturas) {
      lastNumber += 1;
      const id = `C${String(lastNumber).padStart(3, "0")}`;
      coberturasData.push({ //Se añade al array.
        id,
        nombre: cobertura.tipo,
        porcentaje: parseInt(cobertura.porcentaje, 10),
        id_subparcela: idSubparcela,
      });
    }

    // Inserta todas las coberturas de una vez (operación por lotes)
    const { error } = await supabase.from("cobertura").insert(coberturasData);

    if (error) throw error;

    return coberturasData; //Retorna el array de las coberturas insertadas.
  } catch (error) {     //Si se produjo un error.
    throw error;
  }
};

//Obtiene el último número de alteración registrado para generar IDs secuenciales

exports.getLastAlteracionNumber = async () => {
  const { data, error } = await supabase
    .from("alteracion")
    .select("id")
    .order("id", { ascending: false }) // Ordenar por ID de forma descendente
    .limit(1); // Solo un resultado esperado

  if (error) throw error;

  // Extrae el número del ID (ej: de "A001" obtiene 1)
  if (data && data.length > 0) {
    const lastId = data[0].id;
    return parseInt(lastId.substring(1), 10); // Quita la "A" inicial y convierte a entero
  } else {
    return 0; // Si no hay registros, comienza desde 0
  }
};

/**
 * Inserta múltiples alteraciones asociadas a una subparcela en la base de datos
 * afectaciones - Lista de objetos de afectación con tipo y severidad
 *  idSubparcela - ID de la subparcela a la que se asociarán las alteraciones
 *  devuelve un array con las alteraciones insertadas con sus IDs generados
 */

exports.insertAlteraciones = async (afectaciones, idSubparcela) => {
  try {
    const alteracionesData = [];
    // Obtiene el último número para generar IDs secuenciales
    let lastNumber = await this.getLastAlteracionNumber();

    // Prepara los datos para inserción, asignando IDs con formato "A001", "A002", etc.
    for (const afectacion of afectaciones) {
      lastNumber += 1;
      const id = `A${String(lastNumber).padStart(3, "0")}`;
      alteracionesData.push({ //Se añade al array.
        id,
        nombre: afectacion.tipo,
        severidad: afectacion.severidad,
        id_subparcela: idSubparcela,
      });
    }

    // Inserta todas las alteraciones de una vez (operación por lotes)
    const { error } = await supabase
      .from("alteracion")
      .insert(alteracionesData);

    if (error) throw error;

    return alteracionesData; //Devuelve el array
  } catch (error) {     //Si se produce un error.
    throw error;
  }
};

/**
 * Sincroniza las características (coberturas y afectaciones) de múltiples subparcelas
 * Este es el método principal que coordina todo el proceso de sincronización
 * subparcelasCaracteristicas - Objeto donde cada clave es un ID de subparcela y cada valor contiene arrays de coberturas y afectaciones
 * retorna un objeto con los resultados de la sincronización con las coberturas y alteraciones insertadas
 */

exports.sincronizarSubparcelas = async (subparcelasCaracteristicas) => {
  try {
    // Objeto para almacenar todos los resultados de la sincronización
    const resultados = {
      coberturas: [],
      alteraciones: [],
    };

    // Procesa cada subparcela recibida
    for (const idSubparcela in subparcelasCaracteristicas) {
      const subparcela = subparcelasCaracteristicas[idSubparcela];

      // Inserta coberturas si existen para esta subparcela
      if (subparcela.coberturas && subparcela.coberturas.length > 0) {
        const coberturas = await this.insertCoberturas(
          subparcela.coberturas,
          idSubparcela
        );
        resultados.coberturas.push(...coberturas); //Se añade a la constante "resultados"
      }

      // Inserta alteraciones si existen para esta subparcela
      if (subparcela.afectaciones && subparcela.afectaciones.length > 0) {
        const alteraciones = await this.insertAlteraciones(
          subparcela.afectaciones,
          idSubparcela
        );
        resultados.alteraciones.push(...alteraciones); //Se añade a la constante "resultados"
      }
    }

    return resultados;

  } catch (error) {  //Si ocurre un error
    throw error;
  }
};

// Función para obtener el ID de una subparcela por su nombre y conglomerado
exports.getSubparcelaId = async (nombreSubparcela, conglomeradoId) => {
  try {
    const { data: subparcelaData, error: subparcelaError } = await supabase
      .from("subparcela")
      .select("id")
      .eq("nombre_subparcela", nombreSubparcela)
      .eq("id_conglomerado", conglomeradoId)
      .single(); // Solo un resultado esperado

    if (subparcelaError) throw subparcelaError; //Si se produce un error.

    return subparcelaData.id; //Retornamos el id de la subparcela.

  } catch (error) { //Manejo de errores 
    throw error;
  }
};


// Función para obtener los árboles asociados a una subparcela en específico.
exports.getArbolesSubparcela = async (nombreSubparcela, conglomeradoId) => {
  try {

    // Obtener ID de la subparcela usando la función separada
    const subparcelaId = await this.getSubparcelaId(nombreSubparcela, conglomeradoId);

    // Obtener árboles asociados a esa subparcela
    const { data: arboles, error: arbolError } = await supabase
      .from("arbol")
      .select("*")
      .eq("id_subparcela", subparcelaId);

    if (arbolError) throw arbolError;

    // Retornar ambos: id de la subparcela y los árboles
    return {
      subparcelaId,
      arboles,
    };
  } catch (error) { //Manejo de errores
    throw error;
  }
};

// Funcion para obtener las características de una subparcela por su nombre y el id del conglomerado al que pertenece
exports.getCaracteristicasByIdSubparcela = async (
  nombreSubparcela,
  idConglomerado
) => {
  try {
    // Obtener ID de la subparcela usando la función separada
    const subparcelaId = await this.getSubparcelaId(nombreSubparcela, idConglomerado);
    
    // Obtener los datos completos de la subparcela
    const { data: subparcelaData, error: subparcelaCompleteError } = await supabase
      .from("subparcela")
      .select("*")
      .eq("id", subparcelaId)
      .single();
      
    if (subparcelaCompleteError) throw subparcelaCompleteError;

    // Obtener coberturas asociadas a la subparcela
    const { data: coberturas, error: coberturaError } = await supabase
      .from("cobertura")
      .select("*")
      .eq("id_subparcela", subparcelaId);

    if (coberturaError) throw coberturaError;

    // Obtener alteraciones asociadas a la subparcela
    const { data: alteraciones, error: alteracionError } = await supabase
      .from("alteracion")
      .select("*")
      .eq("id_subparcela", subparcelaId);

    if (alteracionError) throw alteracionError;

    return { //Retornamos los datos de la subparcela, las coberturas y las alteraciones
      subparcelaData,
      coberturas,
      alteraciones,
    };

  } catch (error) { //Manejo de errores
    throw error;
  }
};

//Funcion para obtener los id's de todas las subparcelas asociadas a un conglomerado en específico.
exports.getSubparcelasIdByConglomerado = async (conglomeradoId) => {
  try {
    // Obtener los ID's de las subparcelas asociadas al conglomerado, mediante una consulta a la base de datos.
    const { data: subparcelas, error: subparcelaError } = await supabase
      .from("subparcela")
      .select("id")
      .eq("id_conglomerado", conglomeradoId);

    if (subparcelaError) throw subparcelaError;

    return subparcelas.map((subparcela) => subparcela.id); //Retornamos los id's de las subparcelas, en un array.
  } catch (error) { //Manejo de errores
    throw error;
  }
}