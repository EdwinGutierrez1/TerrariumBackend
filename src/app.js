const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const brigadistaRoutes = require('./routes/brigadista.routes');
const coordenadasRoutes = require('./routes/coordenadas.routes');
const referenciaRoutes = require('./routes/referencia.routes'); 
const trayectoRoutes = require('./routes/trayecto.routes');
// Importar otras rutas según necesites

// Configuración
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/brigadista', brigadistaRoutes);
app.use('/api/coordenadas', coordenadasRoutes);
app.use('/api/referencias', referenciaRoutes);
app.use('/api/trayectos', trayectoRoutes);

// Añadir otras rutas

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del backend' });
});

module.exports = app;