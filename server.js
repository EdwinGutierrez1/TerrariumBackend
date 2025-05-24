// Importar la aplicación Express desde el archivo app.js
const app = require("./src/app");

// Cargar las variables de entorno desde el archivo .env
const dotenv = require("dotenv");
dotenv.config();

// Definir el puerto del servidor
const PORT = process.env.PORT || 5000;

// Solo ejecutar listen en desarrollo local, no en Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

// Exportar la app para Vercel
module.exports = app;