import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/dataroutes.js';  // Ruta correcta hacia tu archivo de rutas

const app = express();
const PORT = 4000;

// Middleware para manejar solicitudes JSON y de URL codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ruta principal que maneja todas las solicitudes a /api
app.use('/api', dataRoutes); // Asegúrate de usar /api como prefijo para todas las rutas definidas en dataRoutes

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal', details: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
