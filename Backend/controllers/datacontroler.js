import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';



export const editarArticulo = async (req, res) => {
  const { id } = req.params; // Obtener ID desde la URL
  const { producto, cantidad, modulo, estante, estado, entrada, salida, restante } = req.body; // Obtener datos desde el body

  try {
    // Actualizar el artículo en la base de datos
    const articulo = await Articulo.findByIdAndUpdate(id, {
      producto,
      cantidad,
      modulo,
      estante,
      estado,
      entrada,
      salida,
      restante
    }, { new: true });

    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    return res.json(articulo); // Devolver el artículo actualizado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al editar el artículo" });
  }
};

// Función para eliminar un artículo
export const eliminarArticulo = async (req, res) => {
  const { id } = req.params; // Obtener ID desde la URL

  try {
    // Eliminar el artículo de la base de datos
    const articulo = await Articulo.findByIdAndDelete(id);

    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    return res.json({ message: "Artículo eliminado" }); // Respuesta de éxito
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el artículo" });
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

      return {
        id: row.id,
        fechaEntrada: row.fecha, // Fecha de entrada
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
      SELECT id_productos, cantidad_productos, fecha, solicitante
      FROM movimientos_almacen
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    const { id_productos, cantidad_productos, fecha, solicitante } = result.rows[0];

    // Formatear la fecha para mostrar solo día, mes y año
    const formattedDate = new Date(fecha).toISOString().split('T')[0];

    // Convertir `id_productos` y `cantidad_productos` a arrays
    const idArray = id_productos ? id_productos.split(',') : [];
    const cantidadArray = cantidad_productos
      ? cantidad_productos.split(',').map((cantidad) => parseInt(cantidad, 10))
      : [];

    // Obtener nombres de productos desde la base de datos
    const productsQuery = `
    SELECT id, producto FROM articulos_almacenamiento
      WHERE id = ANY($1::int[]);
    `;
    const productsResult = await pool.query(productsQuery, [idArray]);

    // Crear un mapa de id_producto a su nombre
    const productMap = productsResult.rows.reduce((map, product) => {
      map[product.id] = product.producto;
      return map;
    }, {});

    // Crear los detalles del movimiento
    const detalles = idArray.map((id, index) => ({
      fechaSolicitud: formattedDate,
      producto: productMap[id] || `Producto ${index + 1}`, // Usar el nombre o un fallback
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
const handleSave = async () => {
  try {
    // Validar campos obligatorios
    if (!responsable) {
      alert('Debe ingresar el nombre del responsable.');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Debe seleccionar al menos un producto.');
      return;
    }

    const storedCategory = localStorage.getItem('selectedCategory');
    
    // Simplificar la estructura del movimiento - IMPORTANTE: Removemos articulo_id individual
    const movimiento = {
      tipo_movimiento: estado,
      solicitante: responsable,
      id_productos: selectedProducts.map(p => p.value).join(','),
      cantidad_productos: selectedProducts
        .map(p => p.quantity || 1)
        .join(','),
      rol: storedCategory
    };

    // Enviar un solo movimiento al backend
    const response = await fetch('http://localhost:4000/api/movimientos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movimiento),
    });

    if (!response.ok) {
      throw new Error('Error al registrar movimiento');
    }

    console.log('Movimiento registrado');
    onClose();
  } catch (error) {
    console.error('Error al guardar movimiento:', error);
    alert('Hubo un error al guardar el movimiento');
  }
};

// Backend - createMovimiento.js
export const createMovimiento = async (req, res) => {
  const { tipo_movimiento, solicitante, id_productos, cantidad_productos, rol } = req.body;
  
  try {
    await pool.query('BEGIN');

    try {
      // 1. Crear el registro del movimiento
      const movimientoQuery = `
        INSERT INTO movimientos_almacen (tipo_movimiento, solicitante, id_productos, cantidad_productos, rol)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const movimientoValues = [tipo_movimiento, solicitante, id_productos, cantidad_productos, rol];
      const movimientoResult = await pool.query(movimientoQuery, movimientoValues);

      // 2. Procesar los productos
      const productosIds = id_productos.split(',').map(id => parseInt(id, 10));
      const cantidades = cantidad_productos.split(',').map(cantidad => parseInt(cantidad, 10));

      if (productosIds.length !== cantidades.length) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'Los IDs de productos y las cantidades no coinciden' });
      }

      // 3. Actualizar cada producto
      for (let i = 0; i < productosIds.length; i++) {
        const productoId = productosIds[i];
        const cantidad = cantidades[i];

        // Obtener estado actual del producto
        const stockQuery = `
          SELECT entrada, salida, restante 
          FROM articulos_almacenamiento 
          WHERE id = $1 FOR UPDATE;
        `;
        const stockResult = await pool.query(stockQuery, [productoId]);

        if (stockResult.rows.length === 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ error: `Producto ${productoId} no encontrado` });
        }

        let updateQuery;
        const currentStock = stockResult.rows[0];

        if (tipo_movimiento === 2) { // Entrada
          updateQuery = `
            UPDATE articulos_almacenamiento
            SET 
              entrada = $1,
              restante = $1 - salida
            WHERE id = $2;
          `;
          await pool.query(updateQuery, [currentStock.entrada + cantidad, productoId]);
        } 
        else if (tipo_movimiento === 1) { // Salida
          if (currentStock.restante < cantidad) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: `Stock insuficiente para el producto ${productoId}` });
          }

          updateQuery = `
            UPDATE articulos_almacenamiento
            SET 
              salida = $1,
              restante = entrada - $1
            WHERE id = $2;
          `;
          await pool.query(updateQuery, [currentStock.salida + cantidad, productoId]);
        }
      }

      await pool.query('COMMIT');

      res.status(201).json({
        message: 'Movimiento registrado exitosamente',
        movimiento: movimientoResult.rows[0]
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error en la operación:', error);
    res.status(500).json({ error: 'Error al procesar el movimiento' });
  }
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
