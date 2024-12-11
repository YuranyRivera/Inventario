import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

export const editarArticulo = async (req, res) => {
  const { id } = req.params; // ID del artículo a editar
  const { producto, cantidad, modulo, estante, estado, entrada, salida, restante } = req.body; // Datos enviados desde el cliente

  try {
    // Consulta para actualizar el artículo en la base de datos
    const result = await pool.query(
      `UPDATE articulos_almacenamiento 
       SET 
         producto = $1, 
         cantidad = $2, 
         modulo = $3, 
         estante = $4, 
         estado = $5, 
         entrada = $6, 
         salida = $7, 
         restante = $8 
       WHERE id = $9 
       RETURNING *`, // Devuelve el artículo actualizado
      [producto, cantidad, modulo, estante, estado, entrada, salida, restante, id]
    );

    // Verifica si se actualizó algún artículo
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Devuelve el artículo actualizado
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al editar el artículo:', error);
    res.status(500).json({ message: 'Error al editar el artículo' });
  }
};

// Función para eliminar un artículo
export const eliminarArticulo = async (req, res) => {
  const { id } = req.params; // Obtener ID desde la URL

  try {
    // Eliminar el artículo de la base de datos
    const result = await pool.query(
      `DELETE FROM articulos_almacenamiento 
       WHERE id = $1 
       RETURNING *`, // Devuelve el artículo eliminado
      [id]
    );

    // Verifica si se eliminó algún artículo
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Devuelve el artículo eliminado
    res.status(200).json({ message: "Artículo eliminado" });
  } catch (error) {
    console.error('Error al eliminar el artículo:', error);
    res.status(500).json({ message: "Error al eliminar el artículo" });
  }
};

export const getReporteGeneral = async (req, res) => {
  try {
    // Consulta para obtener los movimientos de la tabla movimientos_almacen
    const query = `
      SELECT 
        id, 
        fecha, 
        cantidad_productos, 
        tipo_movimiento, 
        rol
      FROM movimientos_almacen
      ORDER BY fecha DESC; 
    `;

    // Ejecutar la consulta
    const result = await pool.query(query);

    // Mapear los resultados para obtener el número de productos
    const reporteGeneral = result.rows.map(row => {
      // Verificar si 'cantidad_productos' no es null o vacío
      const cantidadProductos = row.cantidad_productos 
        ? row.cantidad_productos.split(',').length // Contar el número de productos (registros)
        : 0; // Si no tiene productos, asignar 0

      // Determinar el estado según el tipo de movimiento (1 = salida, 2 = entrada)
      const estado = row.tipo_movimiento === 2 ? 'Activo' : 'Inactivo'; // Entrada es activo, salida es inactivo

      // Formatear la fecha en día/mes/año y la hora en formato 12 horas
      const fecha = new Date(row.fecha);
      const fechaEntrada = fecha.toLocaleDateString('es-ES'); // Fecha en formato día/mes/año
       // Hora en formato 12 horas

      return {
        id: row.id,
        fechaEntrada, // Fecha de entrada
      
        cantidadProductos, // Número de productos (cantidad de registros)
        tipoRegistro: row.rol, // Rol (tipo de registro)
        estado, // Estado (activo o inactivo)
      };
    });

    // Enviar el reporte general como respuesta
    res.status(200).json(reporteGeneral);
  } catch (error) {
    console.error('Error al obtener el reporte general:', error);
    res.status(500).json({ error: 'Error al obtener el reporte general' });
  }
};

export const getArticulos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articulos_almacenamiento ORDER BY id ASC');
    res.status(200).json(result.rows); // Devuelve todos los artículos almacenados en orden
  } catch (error) {
    console.error('Error al obtener los artículos', error);
    res.status(500).json({ message: 'Error al obtener los artículos' });
  }
};

// Controlador para obtener los detalles de un movimiento específico
export const getDetallesMovimiento = async (req, res) => {
  const { id } = req.params; // Obtener el id desde los parámetros de la URL

  try {
    // Obtener el movimiento con el ID especificado
    const query = `
      SELECT id_productos, cantidad_productos, fecha, solicitante, nombre_productos
      FROM movimientos_almacen
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    const { id_productos, cantidad_productos, fecha, solicitante, nombre_productos } = result.rows[0];

    // Formatear la fecha para mostrar en formato día/mes/año
    const formattedDate = new Date(fecha).toLocaleDateString('es-ES');

    // Convertir `id_productos` y `cantidad_productos` a arrays
    const idArray = id_productos ? id_productos.split(',') : [];
    const cantidadArray = cantidad_productos
      ? cantidad_productos.split(',').map((cantidad) => parseInt(cantidad, 10))
      : [];

    // Obtener los nombres de los productos directamente desde el campo `nombre_productos`
    const nombreArray = nombre_productos ? nombre_productos.split(',') : [];

    // Crear los detalles del movimiento
    const detalles = idArray.map((id, index) => ({
      fechaSolicitud: formattedDate,
      producto: nombreArray[index] || `Producto ${index + 1}`, // Usar nombre de producto guardado o fallback
      cantidad: cantidadArray[index] || 0,
      fechaEntrega: formattedDate, // Usar la misma fecha de solicitud como ejemplo
      firmaEntrega: solicitante || 'Firma de responsable', // Usar el nombre del solicitante
    }));

    res.status(200).json(detalles);
  } catch (error) {
    console.error('Error al obtener los detalles del movimiento:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del movimiento' });
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

// Backend - createMovimiento.js
export const createMovimiento = async (req, res) => {
  const { tipo_movimiento, solicitante, id_productos, cantidad_productos, rol, nombre_productos } = req.body;

  // Validaciones iniciales
  if (!tipo_movimiento || !solicitante || !id_productos || !cantidad_productos || !rol) {
    return res.status(400).json({
      error: 'Todos los campos son requeridos',
      recibido: { tipo_movimiento, solicitante, id_productos, cantidad_productos, rol },
    });
  }

  try {
    await pool.query('BEGIN');

    // 1. Obtener los nombres de los productos
    const productosIds = id_productos.split(',').map(id => parseInt(id, 10));
    const nombresProductos = await obtenerNombresProductos(productosIds);

    // 2. Crear el registro del movimiento
    const movimientoQuery = `
      INSERT INTO movimientos_almacen (tipo_movimiento, solicitante, id_productos, cantidad_productos, rol, nombre_productos)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const movimientoValues = [tipo_movimiento, solicitante, id_productos, cantidad_productos, rol, nombresProductos.join(',')];
    const movimientoResult = await pool.query(movimientoQuery, movimientoValues);

    // 3. Procesar los productos
    const cantidades = cantidad_productos.split(',').map(cantidad => parseInt(cantidad, 10));

    if (productosIds.length !== cantidades.length) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Los ID de productos y las cantidades no coinciden' });
    }

    // 4. Actualizar cada producto
    for (let i = 0; i < productosIds.length; i++) {
      const productoId = productosIds[i];
      const cantidad = cantidades[i];

      // Obtener estado actual del producto
      const stockQuery = `
        SELECT cantidad, entrada, salida, restante
        FROM articulos_almacenamiento
        WHERE id = $1
        FOR UPDATE;
      `;
      const stockResult = await pool.query(stockQuery, [productoId]);

      if (stockResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: `Producto ${productoId} no encontrado` });
      }

      const stockActual = stockResult.rows[0];

      if (tipo_movimiento === 2) { // Entrada
        // Calcular nuevos valores para entrada
        const nuevaEntrada = (currentStock.entrada || 0) + cantidad;
        const nuevaCantidad = currentStock.cantidad + cantidad; // MODIFICACIÓN: Incrementar cantidad
        const nuevaSalida = currentStock.salida || 0;
        const nuevoRestante = nuevaEntrada - nuevaSalida;
      
        const updateQuery = `
          UPDATE articulos_almacenamiento
          SET 
            entrada = $1,
            cantidad = $2,  // Modificar cantidad
            salida = $3,
            restante = $4
          WHERE id = $5;
        `;
        await pool.query(updateQuery, [
          nuevaEntrada,
          nuevaCantidad,  // Usar la nueva cantidad incrementada
          nuevaSalida,
          nuevoRestante,
          productoId
        ]);
      } else if (tipo_movimiento === 1) { // Salida
        // Verificar si hay suficiente stock disponible
        const stockDisponible = stockActual.cantidad;

        if (stockDisponible < cantidad) {
          await pool.query('ROLLBACK');
          return res.status(400).json({
            error: `Stock insuficiente para el producto ${productoId}. Stock disponible: ${stockDisponible}, Cantidad solicitada: ${cantidad}`,
          });
        }

        // Calcular nuevos valores para salida
        const nuevaSalida = (stockActual.salida || 0) + cantidad;
        const nuevaCantidad = stockActual.cantidad - cantidad;
        const nuevaEntrada = stockActual.entrada || 0;
        const nuevoRestante = nuevaEntrada - nuevaSalida;

        const updateQuery = `
          UPDATE articulos_almacenamiento
          SET salida = $1, cantidad = $2, entrada = $3, restante = $4
          WHERE id = $5;
        `;
        await pool.query(updateQuery, [nuevaSalida, nuevaCantidad, nuevaEntrada, nuevoRestante, productoId]);
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Movimiento registrado exitosamente', movimiento: movimientoResult.rows[0] });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error en la operación:', error);
    res.status(500).json({ error: 'Error al procesar el movimiento' });
  }
};

// Función para obtener los nombres de los productos
const obtenerNombresProductos = async (productosIds) => {
  const query = `
    SELECT producto
    FROM articulos_almacenamiento
    WHERE id = ANY($1::int[]);
  `;
  const resultado = await pool.query(query, [productosIds]);
  return resultado.rows.map(fila => fila.producto);
};




// Función para obtener todos los movimientos
export const getMovimientos = async (req, res) => {
  try {
    // Realizamos la consulta a la base de datos
    const result = await pool.query(`
      SELECT 
        m.id,
        m.fecha,
        m.cantidad,
        m.tipo_registro,
        a.estado
      FROM 
        movimientos_almacen m
      JOIN 
        articulos_almacenamiento a ON m.articulo_id = a.id
      ORDER BY 
        m.fecha DESC;
    `);
    
    // Retornamos los resultados como JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los movimientos:', error);
    res.status(500).send('Error en el servidor');
  }
};


export const createArticulo = async (req, res) => {
  const { id, modulo, estante, producto, cantidad, estado } = req.body;

  // Validaciones
  if (!modulo || !estante || !producto || cantidad === undefined || !estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const client = await pool.connect();

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Insertar el nuevo artículo
    const insertArticuloQuery = `
      INSERT INTO articulos_almacenamiento (id, modulo, estante, producto, cantidad, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, modulo, estante, producto, cantidad, estado, created_at
    `;
    const result = await client.query(insertArticuloQuery, [id, modulo, estante, producto, cantidad, estado]);

    // Confirmar transacción
    await client.query('COMMIT');

    // Responder con el artículo insertado
    res.status(201).json({
      message: 'Artículo creado con éxito',
      articulo: result.rows[0],
    });
  } catch (err) {
    // Revertir transacción en caso de error
    await client.query('ROLLBACK');
    
    console.error('Error al crear el artículo:', err);
    res.status(500).json({ error: 'Error al crear el artículo' });
  } finally {
    // Liberar el cliente
    client.release();
  }
};



export const loginUser = async (correo, contraseña) => {
  try {
    const client = await pool.connect();

    const result = await client.query(
      'SELECT id, correo, contraseña, rol FROM usuarios WHERE correo = $1', 
      [correo]
    );
    client.release();

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (!user.contraseña) {
        console.error('Error: contraseña no encontrada en la base de datos');
        return null;
      }

      const match = await bcrypt.compare(contraseña, user.contraseña);
      if (match) {
        const token = jwt.sign(
          { id: user.id, rol: user.rol, correo: user.correo },
          'tu_clave_secreta',
          { expiresIn: '1h' }
        );
        return { 
          id: user.id,  
          correo: user.correo,
          rol: user.rol,
          token
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};