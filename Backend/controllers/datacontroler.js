import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const getArticulos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articulos_almacenamiento ORDER BY id ASC');
    res.status(200).json(result.rows); // Devuelve todos los artículos almacenados en orden
  } catch (error) {
    console.error('Error al obtener los artículos', error);
    res.status(500).json({ message: 'Error al obtener los artículos' });
  }
};

// Endpoint para obtener el último ID insertado
export const getLastId = async (req, res) => {
  try {
    const result = await pool.query('SELECT id FROM articulos_almacenamiento ORDER BY id DESC LIMIT 1');
    if (result.rows.length > 0) {
      res.status(200).json({ id: result.rows[0].id });
    } else {
      res.status(200).json({ id: 0 });  // Si no hay registros, devuelve 0
    }
  } catch (err) {
    console.error('Error al obtener el último ID:', err);
    res.status(500).json({ error: 'Error al obtener el último ID' });
  }
};

export const deleteArticulo = async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar el artículo de la base de datos
    const result = await pool.query('DELETE FROM articulos_almacenamiento WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Artículo con id ${id} no encontrado` });
    }

    res.status(200).json({ message: `Artículo con id ${id} eliminado` });
  } catch (error) {
    console.error('Error al eliminar el artículo', error);
    res.status(500).json({ message: 'Error al eliminar el artículo' });
  }
};

export const getProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, producto FROM articulos_almacenamiento');
    res.status(200).json(result.rows); // Devuelve todos los productos con su id y nombre
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

export const createMovimiento = async (req, res) => {
  const { articulo_id, tipo_movimiento, cantidad, solicitante } = req.body;

  if (!articulo_id || !tipo_movimiento || !cantidad || !solicitante) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const insertQuery = `
      INSERT INTO movimientos_almacen (articulo_id, tipo_movimiento, cantidad, solicitante)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [articulo_id, tipo_movimiento, cantidad, solicitante]);

    res.status(201).json({
      message: 'Movimiento registrado con éxito',
      movimiento: result.rows[0],
    });
  } catch (error) {
    console.error('Error al registrar el movimiento:', error);
    res.status(500).json({ message: 'Error al registrar el movimiento' });
  }
};


export const createArticulo = async (req, res) => {
  const { modulo, estante, producto, cantidad, estado } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!modulo || !estante || !producto || cantidad === undefined || !estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Insertar el nuevo artículo en la base de datos
    const insertArticuloQuery = `
    INSERT INTO articulos_almacenamiento (modulo, estante, producto, cantidad, estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, modulo, estante, producto, cantidad, estado, created_at
  `;
    const result = await pool.query(insertArticuloQuery, [modulo, estante, producto, cantidad, estado]);

    // Responder con el artículo insertado
    res.status(201).json({
      message: 'Artículo creado con éxito',
      articulo: result.rows[0],
    });
  } catch (err) {
    console.error('Error al crear el artículo:', err);
    res.status(500).json({ error: 'Error al crear el artículo' });
  }
};

export const createUser = async (req, res) => {
  const { correo, contraseña, nombre = '' } = req.body; // Valor predeterminado para nombre

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const checkEmailQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const emailResult = await pool.query(checkEmailQuery, [correo]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Insertar el nuevo usuario
    const insertUserQuery = `
      INSERT INTO usuarios (nombre, correo, contraseña)
      VALUES ($1, $2, $3)
      RETURNING id, correo, nombre
    `;
    const result = await pool.query(insertUserQuery, [nombre, correo, hashedPassword]);

    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};
