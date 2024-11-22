import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

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
