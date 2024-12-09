import React from 'react';
import ProductSelect from './ProductSelect';
import EstadoSelect from './EstadoSelect';
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';
import useMovimientosAlmacen from '../hooks/useMovimientosAlmacen';

const ModalEntrada = ({ isOpen, onClose, reloadArticulos }) => {
  const {
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
  } = useMovimientosAlmacen(isOpen, onClose, reloadArticulos); 

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
          <BotonPrincipal Text="Guardar" onClick={handleSave}  />
          <BotonSecundario Text="Cancelar" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalEntrada;
