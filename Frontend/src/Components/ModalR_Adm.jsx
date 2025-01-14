import React, { useState } from 'react';
import Select from 'react-select';
import ActivoInactivoSelect from './ActivoInactivoSelect';  // Importamos el nuevo componente ActivoInactivoSelect
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';

const ModalSalida = ({ isOpen, onClose }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [solicitante, setSolicitante] = useState('');
  const [estado, setEstado] = useState('activo'); // Estado para la selección de "Activo" o "Inactivo"
  
  const [products] = useState([
    { id: 1, name: 'Producto A' },
    { id: 2, name: 'Producto B' },
    { id: 3, name: 'Producto C' },
    { id: 4, name: 'Producto D' },
  ]);

  const options = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  const handleSelectProduct = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleQuantityChange = (e, productId) => {
    const newQuantity = e.target.value;
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.value === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const handleSave = () => {
    console.log('Salida registrada:', selectedProducts);
    console.log('Solicitante:', solicitante);
    console.log('Estado:', estado); // Imprimir el estado seleccionado
    onClose(); // Cerrar el modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50  inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto  p-6  max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold">Registro Administrativo</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2">
              Selecciona los productos
            </label>
            <Select
              isMulti
              options={options}
              value={selectedProducts}
              onChange={handleSelectProduct}
              placeholder="Seleccionar productos..."
              closeMenuOnSelect={false}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Status Selection */}
          <div>
            <ActivoInactivoSelect currentStatus={estado} onChange={setEstado} />
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium">
                    Producto
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedProducts.map((product) => (
                  <tr key={product.value}>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                      {product.label}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <input
                        type="number"
                        value={product.quantity || 1}
                        onChange={(e) => handleQuantityChange(e, product.value)}
                        className="border rounded w-full p-1 sm:p-2 text-xs sm:text-sm"
                        min="1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Solicitante Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2">
              Solicitante
            </label>
            <input
              type="text"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              className="border rounded w-full p-2 sm:p-3 text-sm sm:text-base"
              placeholder="Nombre del solicitante"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 sm:p-6 border-t bg-gray-50">
          <BotonPrincipal Text="Guardar" onClick={handleSave} />
          <BotonSecundario Text="Cancelar" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalSalida;
