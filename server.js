// Importar la aplicación Express desde el archivo app.js
const app = require("./src/app");

// Cargar las variables de entorno desde el archivo .env
const dotenv = require("dotenv");
dotenv.config();

// Definir el puerto del servidor
// Si no se encuentra el puerto en las variables de entorno, se usará el puerto 5000 por defecto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
