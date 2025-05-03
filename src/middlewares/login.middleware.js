const express = require('express'); // Framework para construir servidores web y APIs en Node.js
const cors = require('cors');       // Middleware para permitir solicitudes desde otros dominios 
const dotenv = require('dotenv');   // Permite cargar variables de entorno desde el archivo .env al entorno de ejecución de Node

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware de logging: muestra en consola la fecha, método y URL de cada petición
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware para habilitar CORS (permite solicitudes desde otros orígenes)
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Middleware para parsear datos codificados en URL (por ejemplo, formularios)
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);   // Rutas relacionadas con autenticación
app.use('/api/users', userRoutes);  // Rutas relacionadas con usuarios

// Ruta base: útil para verificar si el servidor está funcionando
app.get('/', (req, res) => {
    console.log("Petición recibida en la ruta raíz");
    res.json({ message: 'Bienvenido a la API del backend' });
});

module.exports = app;