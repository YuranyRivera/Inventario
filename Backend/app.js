import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dataRoutes from './routes/dataroutes.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',   // Local development
  'http://127.0.0.1:5173',   // Otra variante local
  'https://front-inventarioschool-v1.onrender.com', // Frontend en Render
  'https://inventarioschool-v1.onrender.com' // Backend en Render
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Permitir preflight requests
app.options('*', cors(corsOptions));

// Middleware para asegurar que las cabeceras CORS siempre estén presentes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://front-inventarioschool-v1.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Middleware
app.use(express.json()); // Para procesar JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', dataRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal', details: err.message });
});

// Server start
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
