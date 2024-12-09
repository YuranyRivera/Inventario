import { useState, useEffect } from 'react';

const useMovimientosAlmacen = (isOpen, onClose, reloadArticulos) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [responsable, setResponsable] = useState('');
  const [estado, setEstado] = useState(2); // Estado inicial como número (2 para entrada)
  const [products, setProducts] = useState([]); // Productos cargados desde la API

  useEffect(() => {
    if (isOpen) {
      fetchProductos();
    }
  }, [isOpen]);

  // Función para cargar productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/productos');
      const data = await response.json();
      setProducts(data); // Guardar productos en el estado
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }
  };

  // Opciones para el selector de productos
  const options = products.map((product) => ({
    value: product.id,
    label: product.producto, // Nombre del producto
  }));

  // Manejar la selección de productos
  const handleSelectProduct = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  // Manejar el cambio de cantidad para un producto
  const handleQuantityChange = (e, productId) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.value === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  // Manejar la acción de guardar
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
      
      // Simplificar la estructura del movimiento
      const movimiento = {
        tipo_movimiento: estado,
        solicitante: responsable,
        id_productos: selectedProducts.map(p => p.value).join(','),
        cantidad_productos: selectedProducts.map(p => p.quantity || 1).join(','),
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

      // Llamar a reloadArticulos después de guardar el movimiento
      reloadArticulos();

      console.log('Movimiento registrado');
      onClose();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      alert('Hubo un error al guardar el movimiento');
    }
  };

  return {
    selectedProducts,
    responsable,
    estado,
    products,
    options,
    handleSelectProduct,
    handleQuantityChange,
    handleSave,
    setResponsable,
    setEstado,
  };
};

export default useMovimientosAlmacen;
