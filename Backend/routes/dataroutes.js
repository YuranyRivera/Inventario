import express from 'express';
import { getDetallesMovimiento, getLastId, getReporteGeneral, getMovimientos, createMovimiento, getArticulos, deleteArticulo, getProductos, createUser, createArticulo } from '../controllers/datacontroler.js';

const router = express.Router();

// Ruta para obtener el último ID
router.get('/articulos/last-id', getLastId); // Cambié el nombre de la ruta a /articulos/ultimo-id

// Otras rutas...
router.post('/articulos', createArticulo);
router.get('/articulos', getArticulos); 
// Define la ruta para obtener detalles de un movimiento específico


// Ruta para obtener el reporte general
router.get('/reporte-general', getReporteGeneral);
router.get('/movimiento/:id', getDetallesMovimiento);
router.get('/productos', getProductos); 
// Ruta para obtener los movimientos
router.get('/movimientos', getMovimientos);
// Ruta para crear un nuevo movimiento
router.post('/movimientos', createMovimiento);
router.delete('/articulos/:id', deleteArticulo);
router.post('/usuarios', createUser);  // Endpoint POST para crear un usuario

export default router;
