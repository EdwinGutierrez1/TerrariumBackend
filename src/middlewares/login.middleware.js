const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
// Importar otras rutas según necesites

// Configuración
dotenv.config();
const app = express();

// Middleware para logging de peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Añadir otras rutas

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    console.log("Petición recibida en la ruta raíz");
    res.json({ message: 'Bienvenido a la API del backend' });
});

module.exports = app;