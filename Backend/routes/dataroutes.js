import express from 'express';
import { editarPerfil, crearUsuario, obtenerUsuarios, eliminarUsuario,   loginUser, editarArticulo, eliminarArticulo,  getDetallesMovimiento, getLastId, getReporteGeneral, getMovimientos, createMovimiento, getArticulos, deleteArticulo, getProductos, createArticulo } from '../controllers/datacontroler.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const user = await loginUser(correo, contraseña);
    if (user) {
      console.log('Usuario encontrado:', user);

      // Usa una clave secreta segura
      const token = jwt.sign(
        { id: user.id, rol: user.rol, correo: user.correo },
        process.env.JWT_SECRET, // Asegúrate de que JWT_SECRET esté definido en .env
        { expiresIn: '1h' }
      );

      // Configuración de cookies más explícita
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Cambia a true en producción
        sameSite: 'lax', // Cambia según tu necesidad
        maxAge: 3600000 // 1 hora
      });

      console.log('Cookie establecida');

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          correo: user.correo,
          rol: user.rol
        },
        token: token // Envía también el token en la respuesta
      });
    } else {
      res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
router.post('/logout', (req, res) => {
  console.log('Logout request received');
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Cambia a true en producción
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'Logout successful' });
});

// Ruta para obtener el último ID
router.get('/articulos/last-id', getLastId); // Cambié el nombre de la ruta a /articulos/ultimo-id
// Crear un nuevo usuario
router.post('/usuarios', crearUsuario);

// Obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios);

// Ruta para actualizar el perfil del usuario
router.put('/usuarios/:id', editarPerfil); // La ruta recibe el ID del usuario como parámetro
// Eliminar un usuario por ID
router.delete('/usuarios/:id', eliminarUsuario);
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