/**
 * Configuración principal del servidor Express
 * Este archivo configura el servidor web, middlewares y rutas de la API
 */


const express = require('express');  // Framework para Node.js
const cors = require('cors');        // Middleware que permite solicitudes de origen cruzado (CORS)
const dotenv = require('dotenv');    // Carga variables de entorno desde archivos .env para configuración segura


// Cada archivo contiene endpoints específicos para diferentes recursos de la aplicación
const authRoutes = require('./routes/auth.routes');          
const userRoutes = require('./routes/user.routes');         
const brigadistaRoutes = require('./routes/brigadista.routes'); 
const coordenadasRoutes = require('./routes/coordenadas.routes'); 
const referenciaRoutes = require('./routes/referencia.routes');   
const trayectoRoutes = require('./routes/trayecto.routes');      
const subparcelaRoutes = require('./routes/subparcela.routes');   
const muestrasRoutes = require('./routes/muestras.routes');       
const individuosRoutes = require('./routes/individuos.routes');   


dotenv.config();  // Carga variables desde .env al objeto process.env

// Creación de la instancia principal de Express
const app = express();

app.use(cors());  // Habilita CORS para todas las rutas - permite comunicación entre frontend y backend
app.use(express.json());  // Analiza solicitudes entrantes con payloads JSON
app.use(express.urlencoded({ extended: true }));  // Analiza datos de formularios 

//Registro de rutas de la API 
// Cada grupo de rutas se monta bajo un prefijo específico para organizar la estructura de la API
app.use('/api/auth', authRoutes);                
app.use('/api/users', userRoutes);               
app.use('/api/brigadista', brigadistaRoutes);    
app.use('/api/coordenadas', coordenadasRoutes);  
app.use('/api/referencias', referenciaRoutes);   
app.use('/api/trayectos', trayectoRoutes);       
app.use('/api/subparcelas', subparcelaRoutes);   
app.use('/api/muestras', muestrasRoutes);        
app.use('/api/individuos', individuosRoutes);    

// Ruta principal 
// Endpoint de diagnóstico para verificar que el servidor está funcionando correctamente
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del backend' });
});

// Exportación del objeto app configurado para ser utilizado en otros archivos (server.js)
module.exports = app;