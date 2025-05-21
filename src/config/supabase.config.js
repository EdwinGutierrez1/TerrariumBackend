// Importa la función createClient de la biblioteca de Supabase para Node.js
// Esta función permite crear una instancia del cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Importa la biblioteca dotenv para cargar variables de entorno desde un archivo .env
const dotenv = require('dotenv');

// Carga las variables de entorno definidas en el archivo .env
dotenv.config();

// Obtiene la URL de la instancia de Supabase desde las variables de entorno
// Esta URL identifica tu proyecto específico de Supabase
const supabaseUrl = process.env.SUPABASE_URL;

// Obtiene la clave de API de Supabase desde las variables de entorno
// Esta clave permite autenticar las solicitudes a la API de Supabase
const supabaseKey = process.env.SUPABASE_KEY;

// Crea una instancia del cliente de Supabase con la URL y la clave de API
// Este cliente permite interactuar con la base de datos y otros servicios de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta la instancia del cliente de Supabase configurada
// Esto permite importar este cliente en otros archivos del proyecto
module.exports = supabase;