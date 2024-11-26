import React, { useState } from 'react';
import Select, { components } from 'react-select';
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';

const ModalTiquete = ({ isOpen, onClose }) => {
  const [selectedProducts, setSelectedProducts] = useState([]); // Productos seleccionados
  const [responsable, setResponsable] = useState('');
  const [products] = useState([
    { id: 1, name: 'Producto A' },
    { id: 2, name: 'Producto B' },
    { id: 3, name: 'Producto C' },
    { id: 4, name: 'Producto D' },
  ]);

  // Convertir productos en el formato adecuado para react-select
  const options = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  // Manejar la selección de productos
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

  const handleResponsableChange = (e) => {
    setResponsable(e.target.value);
  };

  const handleSave = () => {
    console.log('Productos seleccionados:', selectedProducts);
    console.log('Responsable:', responsable);
    onClose(); // Cerrar el modal
  };

  if (!isOpen) return null;

  // Personalización de la opción del select con checkbox
  const CustomOption = (props) => {
    const { data, innerRef, innerProps, isSelected, selectOption } = props;

    return (
      <div ref={innerRef} {...innerProps} className="flex items-center p-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => selectOption(data)} // Selección múltiple
          className="mr-2"
        />
        {data.label}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Crear Tiquete</h3>
          <button
            onClick={onClose}
            className="text-xl"
          >
            X
          </button>
        </div>

        {/* Menú desplegable con react-select y checkboxes */}
        <div className="mb-4">
          <label className="block text-lg mb-2">Selecciona los productos</label>
          <Select
            isMulti
            name="products"
            options={options}
            value={selectedProducts} // Mostrar los productos seleccionados
            onChange={handleSelectProduct}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Buscar y seleccionar productos..."
            components={{ Option: CustomOption }} // Usamos el componente con checkbox
            closeMenuOnSelect={false} // Evitar que el menú se cierre automáticamente
          />
        </div>

        {/* Tabla con productos seleccionados */}
        <div className="mb-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#00A305] text-white">
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

        {/* Campo de responsable */}
        <div className="mb-4">
          <label className="block text-lg mb-2">A: Responsable</label>
          <input
            type="text"
            value={responsable}
            onChange={handleResponsableChange}
            className="border p-2 w-full rounded"
            placeholder="Nombre del responsable"
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end space-x-4">
  {/* Botón Guardar */}
  <BotonPrincipal 
    type="button" // Cambié a "button" para evitar el comportamiento por defecto del formulario
    Text="Guardar"
    onClick={handleSave} // Usar la lógica existente
  />

  {/* Botón Cancelar */}
  <BotonSecundario 
    type="button" // Cambié a "button" para evitar recargar la página
    Text="Cancelar"
    onClick={onClose} // Llamar directamente a onClose
  />
</div>

      </div>
    </div>
  );
};

export default ModalTiquete;
