import express from 'express';
import { createUser,  loginUser, editarArticulo, eliminarArticulo,  getDetallesMovimiento, getLastId, getReporteGeneral, getMovimientos, createMovimiento, getArticulos, deleteArticulo, getProductos, createArticulo } from '../controllers/datacontroler.js';

const router = express.Router();
router.post('/usuarios', createUser);  
router.post('/login', async (req, res) => {
    console.log(req.body); // Verifica los datos que llegan al servidor
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
      const user = await loginUser(correo, contraseña);
      if (user) {
        res.status(200).json({
          message: 'Inicio de sesión exitoso',
          user: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol
          },
          token: user.token
        });
      } else {
        res.status(400).json({ error: 'Correo o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener el último ID
router.get('/articulos/last-id', getLastId); // Cambié el nombre de la ruta a /articulos/ultimo-id

// Otras rutas...
router.post('/articulos', createArticulo);
router.get('/articulos', getArticulos); 
// Define la ruta para obtener detalles de un movimiento específico
// Ruta para editar un artículo
router.put('/articulos/:id', editarArticulo);

// Ruta para eliminar un artículo
router.delete('/articulos/:id', eliminarArticulo);


// Ruta para obtener el reporte general
router.get('/reporte-general', getReporteGeneral);
router.get('/movimiento/:id', getDetallesMovimiento);
router.get('/productos', getProductos); 
// Ruta para obtener los movimientos
router.get('/movimientos', getMovimientos);
// Ruta para crear un nuevo movimiento
router.post('/movimientos', createMovimiento);
router.delete('/articulos/:id', deleteArticulo);


export default router;
