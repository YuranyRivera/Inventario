import React, { useState, useEffect } from 'react';
import ProductSelect from './ProductSelect';
import EstadoSelect from './EstadoSelect';  
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';

const ModalEntrada = ({ isOpen, onClose }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [responsable, setResponsable] = useState('');
  const [estado, setEstado] = useState(2); // Estado inicial como número (2 para entrada)
  const [products, setProducts] = useState([]); // Productos cargados desde la API

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/productos');
        const data = await response.json();
        setProducts(data); // Guardar productos en el estado
      } catch (error) {
        console.error('Error al obtener los productos', error);
      }
    };

    if (isOpen) {
      fetchProductos();
    }
  }, [isOpen]);

  const options = products.map((product) => ({
    value: product.id,
    label: product.producto, // Nombre del producto
  }));

  const handleSelectProduct = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleQuantityChange = (e, productId) => {
    const newQuantity = parseInt(e.target.value, 10) || 1; // Asegurarse de que sea un número
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.value === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const handleSave = async () => {
    try {
      // Verificar campos obligatorios
      if (!responsable) {
        alert('Debe ingresar el nombre del responsable.');
        return;
      }

      if (selectedProducts.length === 0) {
        alert('Debe seleccionar al menos un producto.');
        return;
      }

      // Mapear productos seleccionados
      const movimientos = selectedProducts.map(product => ({
        articulo_id: product.value,        // ID del producto
        tipo_movimiento: estado,          // 1 para salida, 2 para entrada
        cantidad: product.quantity || 1,  // Cantidad seleccionada (por defecto 1)
        solicitante: responsable          // Responsable
      }));

      // Enviar datos al backend
      await Promise.all(
        movimientos.map(async (movimiento) => {
          await fetch('http://localhost:4000/api/movimientos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(movimiento),
          });
        })
      );

      console.log('Movimientos registrados:', movimientos);
      onClose(); // Cerrar modal después de guardar
    } catch (error) {
      console.error('Error al guardar movimientos:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Registro de Almacenamiento</h3>
          <button onClick={onClose} className="text-xl">X</button>
        </div>

        {/* Componente ProductSelect */}
        <ProductSelect
          options={options}
          value={selectedProducts}
          onChange={handleSelectProduct}
        />

        {/* Componente EstadoSelect */}
        <div className="mb-4">
          <EstadoSelect currentStatus={estado} onChange={setEstado} />
        </div>

        <div className="mb-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product) => (
                <tr key={product.value}>
                  <td className="px-4 py-2">{product.label}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      value={product.quantity || 1}
                      onChange={(e) => handleQuantityChange(e, product.value)}
                      className="border p-2 rounded w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Responsable</label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Nombre del responsable"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <BotonPrincipal Text="Guardar" onClick={handleSave} />
          <BotonSecundario Text="Cancelar" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalEntrada;
