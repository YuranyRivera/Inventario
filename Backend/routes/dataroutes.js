import express from 'express';
import { getLastId, createMovimiento, getArticulos, deleteArticulo, getProductos, createUser, createArticulo } from '../controllers/datacontroler.js';

const router = express.Router();

// Ruta para obtener el último ID
router.get('/articulos/last-id', getLastId); // Cambié el nombre de la ruta a /articulos/ultimo-id

// Otras rutas...
router.post('/articulos', createArticulo);
router.get('/articulos', getArticulos); 
router.get('/productos', getProductos); 
// Ruta para crear un nuevo movimiento
router.post('/movimientos', createMovimiento);
router.delete('/articulos/:id', deleteArticulo);
router.post('/usuarios', createUser);  // Endpoint POST para crear un usuario

export default router;
