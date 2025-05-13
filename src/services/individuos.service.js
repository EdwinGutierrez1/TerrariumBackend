const supabase = require("../config/supabase.config");    
    
    // Función para obtener el siguiente ID de individuo (árbol)
    exports.obtenerSiguienteIdIndividuo = async () => {
        try {
            // Realiza una consulta a la tabla individuo para obtener el último ID
            const { data, error } = await supabase
            .from("arbol")
            .select("id")
            .order("id", { ascending: false })
            .limit(1);
            
            if (error) {
            console.error("Error al obtener el último ID:", error);
            throw error;
            }
            
            if (data.length === 0) {
            // Si no hay individuos en la tabla, el primer ID será A001
            return "A001";
            }
            
            // Obtener el último ID
            const ultimoId = data[0].id;
            
            // Extraer el número del ID (por ejemplo: A001 -> 1)
            // Primero eliminamos el prefijo "A" y luego convertimos la parte numérica a un número entero en base 10
            const numeroStr = ultimoId.replace("A", "");
            const numero = parseInt(numeroStr, 10);
            
            // Verificar que el número sea válido
            if (isNaN(numero)) {
                console.error("Error: El ID recuperado no tiene el formato esperado:", ultimoId);
                return "A001"; // Valor por defecto si hay un error
            }
            
            // Incrementamos el número en uno para generar el siguiente ID
            const siguienteNumero = numero + 1;
            
            // Convertimos el número a string y le añadimos ceros a la izquierda hasta tener 3 dígitos
            // Luego lo concatenamos con el prefijo "A" para obtener el nuevo ID
            const siguienteId = `A${siguienteNumero.toString().padStart(3, "0")}`;
            
            // Devolvemos el nuevo ID generado, por ejemplo: "A002"
            return siguienteId;
        } catch (error) {
            // Si ocurre algún error en la función
            console.error("Error al obtener el siguiente ID:", error);
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
        .order("id", { ascending: false })
        .limit(1);
        
        if (error) {
            console.error("Error al obtener el último ID de registro:", error);
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
            console.error("Error: El ID de registro recuperado no tiene el formato esperado:", ultimoId);
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
        console.error("Error al obtener el siguiente ID de registro:", error);
        throw error;
    }
};


exports.guardarIndividuo = async (individuo) => {
    try {
        console.log("Datos recibidos en el servicio:", individuo);
        
        // Verificar que todos los campos necesarios estén presentes
        if (!individuo.subparcelaId) {
            throw new Error("El ID de subparcela es obligatorio");
        }
        
        // Preparar datos para la tabla arbol
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
        
        console.log("Datos formateados para inserción en arbol:", individuoData);
    
        // Almacena el individuo en la tabla arbol de la base de datos
        const { data: arbolData, error: arbolError } = await supabase
            .from("arbol")
            .insert(individuoData)
            .select("id");
    
        if (arbolError) {
            console.error("Error específico de Supabase al insertar en arbol:", arbolError);
            throw new Error(`Error de Supabase: ${arbolError.message || arbolError.details || JSON.stringify(arbolError)}`);
        }
        
        console.log("Respuesta de Supabase para arbol:", arbolData);
    
        if (!arbolData || arbolData.length === 0) {
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
            id_arbol: arbolData[0].id  // CAMBIO AQUÍ: Usar el ID devuelto por la inserción del árbol
        };
        
        console.log("Datos formateados para inserción en registro:", datosRegistro);
        
        // Almacena los datos en la tabla registro
        const { data: registroData, error: registroError } = await supabase
            .from("registro")
            .insert(datosRegistro)
            .select("id");
            
        if (registroError) {
            console.error("Error específico de Supabase al insertar en registro:", registroError);
            // Aunque haya error en registro, no abortamos la operación ya que el árbol ya se guardó
            console.warn("El árbol se guardó pero hubo un error al guardar el registro");
        } else {
            console.log("Respuesta de Supabase para registro:", registroData);
        }
        
        return arbolData[0].id; // Devuelve el ID del individuo almacenado
    } catch (error) {
        console.error("Error completo al insertar individuo:", error);
        throw error;
    }
};



exports.getIndividuosByConglomerado = async (subparcelasIds) => {
    try {
        // Realiza una consulta a la tabla individuo para obtener los individuos que pertenecen a las subparcelas especificadas
        const { data, error } = await supabase
            .from("arbol")
            .select("*")
            .in("id_subparcela", subparcelasIds);
        
        if (error) {
            console.error("Error al obtener los individuos:", error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error("Error en la función getIndividuosByConglomerado:", error);
        throw error;
    }
};