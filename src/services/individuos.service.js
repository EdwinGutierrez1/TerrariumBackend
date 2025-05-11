const supabase = require("../config/supabase.config");    
    
    // Función para obtener el siguiente ID de individuo (árbol)
    exports.obtenerSiguienteIdIndividuo = async () => {
    try {
        // Realiza una consulta a la tabla individuo para obtener el último ID
        const { data, error } = await supabase
        .from("individuo")
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
        const numero = parseInt(ultimoId.replace("A", ""), 10);
        
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
}