//LISTO
const supabase = require("../config/supabase.config"); //Se importa el módulo de configuración para supabase.

// Función para obtener el siguiente ID de individuo (árbol)
exports.obtenerSiguienteIdIndividuo = async () => {
    try {
        // Realiza una consulta a la tabla individuo para obtener el último ID
        const { data, error } = await supabase
            .from("arbol")
            .select("id")
            .order("id", { ascending: false }) // Orden descendente para obtener el último ID
            .limit(1); // Limitamos a 1 para obtener solo el último ID

        if (error) { //Si hay un error
            throw error;
        }

        if (data.length === 0) {
            // Si no hay individuos en la tabla, el primer ID será A001
            return "AR001";
        }

        // Obtener el último ID (Si data no está vacío)
        const ultimoId = data[0].id;

        // Extraer el número del ID (por ejemplo: A001 -> 1)
        // Primero eliminamos el prefijo "A" y luego convertimos la parte numérica a un número entero en base 10
        const numeroStr = ultimoId.replace("AR", "");
        const numero = parseInt(numeroStr, 10);

        // Verificar que el número sea válido
        if (isNaN(numero)) {
            return "AR001"; // Valor por defecto si hay un error
        }

        // Incrementamos el número en uno para generar el siguiente ID
        const siguienteNumero = numero + 1;

        // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
        // Luego lo concatenamos con el prefijo "A" para obtener el nuevo ID
        const siguienteId = `AR${siguienteNumero.toString().padStart(3, "0")}`;

        // Devolvemos el nuevo ID generado, por ejemplo: "A002"
        return siguienteId;
    } catch (error) {
        // Si ocurre algún error en la función
        throw error;
    }
};

// Función para obtener el siguiente ID de registro
exports.obtenerSiguienteIdRegistro = async () => {
    try {
        // Realiza una consulta a la tabla registro para obtener el último ID
        const { data, error } = await supabase
            .from("registro")
            .select("id")
            .order("id", { ascending: false }) // Orden descendente para obtener el último ID
            .limit(1); // Limitamos a 1 para obtener solo el último ID

        if (error) { //Si hay un error
            throw error;
        }

        if (data.length === 0) {
            // Si no hay registros en la tabla, el primer ID será R001
            return "R001";
        }

        // Obtener el último ID
        const ultimoId = data[0].id;

        // Extraer el número del ID (por ejemplo: R001 -> 1)
        const numeroStr = ultimoId.replace("R", "");
        const numero = parseInt(numeroStr, 10);

        // Verificar que el número sea válido
        if (isNaN(numero)) {
            return "R001"; // Valor por defecto si hay un error
        }

        // Incrementamos el número en uno para generar el siguiente ID
        const siguienteNumero = numero + 1;

        // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
        // Luego lo concatenamos con el prefijo "R" para obtener el nuevo ID
        const siguienteId = `R${siguienteNumero.toString().padStart(3, "0")}`;

        // Devolvemos el nuevo ID generado, por ejemplo: "R002"
        return siguienteId;
    } catch (error) {
        // Si ocurre algún error en la función
        throw error;
    }
};


exports.guardarIndividuo = async (individuo) => {
    try {

        // Verificar que el individuo tenga el id de la subparcela a la que pertenece.
        if (!individuo.subparcelaId) {
            throw new Error("El ID de subparcela es obligatorio");
        }

        // Preparar datos para la tabla arbol
        // Si el individuo no tiene alguno de estos campos, se asigna null.
        const individuoData = {
            id: individuo.idIndividuo,
            tamaño_individuo: individuo.tamanoIndividuo || null,
            condicion: individuo.condicion || null,
            azimut: parseFloat(individuo.azimut) || null,
            distancia_del_centro: parseFloat(individuo.distanciaCentro) || null,
            tallo: individuo.tallo || null,
            diametro: parseFloat(individuo.diametro) || null,
            altura_total: parseFloat(individuo.alturaTotal) || null,
            forma_fuste: individuo.formaFuste || null,
            daño: individuo.dano || null,
            penetracion: individuo.penetracion ? parseFloat(individuo.penetracion) : null, 
            id_subparcela: individuo.subparcelaId,
        };

        // Almacena el individuo en la tabla arbol de la base de datos
        const { data: arbolData, error: arbolError } = await supabase
            .from("arbol")
            .insert(individuoData)
            .select("id"); // Se selecciona el ID para usarlo después

        if (arbolError) { //Si hay un error
            throw new Error(`Error de Supabase: ${arbolError.message || arbolError.details || JSON.stringify(arbolError)}`);
        }

        if (!arbolData || arbolData.length === 0) { //Si por algún motivo no se obtuvo el id del árbol luego de insertarlo.
            throw new Error("No se recibió ID después de la inserción en arbol");
        }

        // Generar ID para el registro
        const registroId = await this.obtenerSiguienteIdRegistro();

        // Preparar datos para la tabla registro
        const datosRegistro = {
            id: registroId,
            distancia_horizontal: individuo.distanciaHorizontal ? parseFloat(individuo.distanciaHorizontal) : null,
            angulo_vista_abajo: individuo.anguloVistoBajo ? parseFloat(individuo.anguloVistoBajo) : null,
            angulo_vista_arriba: individuo.anguloVistoAlto ? parseFloat(individuo.anguloVistoAlto) : null,
            cedula_brigadista: individuo.cedula_brigadista || null,
            id_arbol: arbolData[0].id  // Usamos el ID del árbol que acabamos de insertar
        };

        // Almacena los datos en la tabla registro
        const { data: registroData, error: registroError } = await supabase
            .from("registro")
            .insert(datosRegistro)
            .select("id"); // Se selecciona el ID para usarlo después

        if (registroError) {
            // Aunque haya error en registro, no abortamos la operación ya que el árbol ya se guardó
        }

        return arbolData[0].id; // Devuelve el ID del individuo almacenado
    } catch (error) {
        throw error;
    }
};

exports.getIndividuosByConglomerado = async (subparcelasIds) => {
    try {

        // Realiza una consulta a la tabla arbol para obtener los individuos arboreos que pertenecen a las subparcelas especificadas
        const { data, error } = await supabase
            .from("arbol")
            .select("*")
            .in("id_subparcela", subparcelasIds); //El valor del campo id_subparcela debe estar en el array subparcelasIds. 

        if (error) { //Si hay un error
            throw error;
        }

        return data; //Devuelve los datos obtenidos
    } catch (error) { 
        throw error;
    }
};