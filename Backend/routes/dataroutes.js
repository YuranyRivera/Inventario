import express from 'express';
import {  createUser } from '../controllers/datacontroler.js';

const router = express.Router();



// Ruta para crear un nuevo usuario
router.post('/usuarios', createUser);  // Endpoint POST para crear un usuario
 
export default router;