import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dataRoutes from './routes/dataroutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',   // Local development
  'http://127.0.0.1:5173',   // Another local dev variation
  'https://your-vercel-domain.app', // Replace with your actual deployed frontend domain
  'https://your-netlify-domain.app' // Add other possible domains
];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
      // En desarrollo, permitir todos los orígenes
      if (!origin || 
          origin.includes('localhost') || 
          origin.includes('127.0.0.1')) {
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