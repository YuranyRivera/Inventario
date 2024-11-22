import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/dataroutes.js';  // Rutas del nuevo proyecto

const app = express();
const PORT = 4000;

// Middleware para manejar solicitudes JSON y de URL codificadas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas de la API
app.use('/api', dataRoutes); // Rutas con el prefijo /api

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal', details: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
