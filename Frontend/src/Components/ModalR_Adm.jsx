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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Registro Administrativo</h3>
          <button onClick={onClose} className="text-xl">X</button>
        </div>
        
        <div className="mb-4">
          <label className="block text-lg mb-2">Selecciona los productos</label>
          <Select
            isMulti
            options={options}
            value={selectedProducts}
            onChange={handleSelectProduct}
            placeholder="Seleccionar productos..."
            closeMenuOnSelect={false}
          />
        </div>

        {/* Reemplazamos el EstadoSelect por ActivoInactivoSelect */}
        <div className="mb-4">
          <ActivoInactivoSelect currentStatus={estado} onChange={setEstado} />
        </div>

        <div className="mb-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-red-500 text-white">
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
          <label className="block text-lg mb-2">Solicitante</label>
          <input
            type="text"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Nombre del solicitante"
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

export default ModalSalida;
