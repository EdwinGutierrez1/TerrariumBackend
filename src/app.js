
const express = require('express');  // Framework para construir el servidor web
const cors = require('cors');        // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const dotenv = require('dotenv');    // Carga variables de entorno desde el archivo .env

// Importación de las rutas definidas en archivos separados
const authRoutes = require('./routes/auth.routes');    // Rutas de autenticación
const userRoutes = require('./routes/user.routes');     // Rutas de usuarios
const brigadistaRoutes = require('./routes/brigadista.routes');   
const coordenadasRoutes = require('./routes/coordenadas.routes'); 
const referenciaRoutes = require('./routes/referencia.routes');   
const trayectoRoutes = require('./routes/trayecto.routes');       
const subparcelaRoutes = require('./routes/subparcela.routes');   
const muestrasRoutes = require('./routes/muestras.routes');
const individuosRoutes = require('./routes/individuos.routes');

// Configurar variables de entorno desde .env
dotenv.config();

// Crear la instancia de la aplicación Express
const app = express();

// Middlewares globales
app.use(cors());            // Habilitar CORS para permitir solicitudes desde el frontend
app.use(express.json());    // Parsear cuerpos de solicitud en formato JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios codificados en URL

// Registro de rutas bajo prefijos específicos
app.use('/api/auth', authRoutes);               
app.use('/api/users', userRoutes);           
app.use('/api/brigadista', brigadistaRoutes);  
app.use('/api/coordenadas', coordenadasRoutes); 
app.use('/api/referencias', referenciaRoutes);  
app.use('/api/trayectos', trayectoRoutes);    
app.use('/api/subparcelas', subparcelaRoutes); 
app.use('/api/muestras', muestrasRoutes);  
app.use('/api/individuos', individuosRoutes);       // Rutas para manejar muestras

// Ruta raíz del servidor para comprobar si está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del backend' });
});

// Exportar la aplicación para ser usada por otros archivos.
module.exports = app;
