import express from 'express';
import { getArticulos,  getProductos,  createUser, createArticulo } from '../controllers/datacontroler.js';

const router = express.Router();

// Ruta para crear un nuevo artículo
router.post('/articulos', createArticulo);
router.get('/articulos', getArticulos); 
// Ruta para obtener todos los productos
router.get('/productos', getProductos); 

// Ruta para crear un nuevo usuario
router.post('/usuarios', createUser);  // Endpoint POST para crear un usuario
 
export default router;