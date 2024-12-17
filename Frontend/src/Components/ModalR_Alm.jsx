import React, { useState } from 'react';
import ProductSelect from './ProductSelect';
import EstadoSelect from './EstadoSelect';
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';
import useMovimientosAlmacen from '../hooks/useMovimientosAlmacen';
import ModalConfirmacion from './ModalConfirmacion';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const ModalEntrada = ({ isOpen, onClose, reloadArticulos }) => {
  const {
    selectedProducts,
    responsable,
    estado,
    options,
    error,
    loading,
    handleSelectProduct,
    handleQuantityChange,
    handleSave,
    setResponsable,
    setEstado,
    resetForm,
  } = useMovimientosAlmacen(isOpen, onClose, reloadArticulos);

  const [errors, setErrors] = useState({
    responsable: '',
    productos: '',
    cantidad: '',
    estado: '',
  });

  const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  const handleConfirmacionClose = () => {
    setErrors({
      responsable: '',
      productos: '',
      cantidad: '',
      estado: '',
    });
    setIsModalConfirmacionOpen(false);
    resetForm();
    onClose();
  };

  const handleGuardar = async () => {
    if (loading) return; // Prevenir múltiples envíos
  
    // Inicializa el estado de errores
    const newErrors = {
      responsable: '',
      productos: '',
      cantidad: '',
      estado: '',
    };
  
    let isValid = true;
  
    // Validar responsable
    if (!responsable.trim()) {
      newErrors.responsable = 'El responsable es obligatorio.';
      isValid = false;
    }
  
    // Validar productos
    if (selectedProducts.length === 0) {
      newErrors.productos = 'Debe seleccionar al menos un producto.';
      isValid = false;
    } else {
      // Validar cantidad de productos
      selectedProducts.forEach((product) => {
        if (!product.quantity || product.quantity <= 0) {
          newErrors.cantidad = 'La cantidad debe ser mayor que 0.';
          isValid = false;
        }
      });
    }

    // Validar estado (entrada/salida)
    if (!estado) {
      newErrors.estado = 'Debe seleccionar un estado (Entrada o Salida).';
      isValid = false;
    }
  
    // Si hay errores, actualizar el estado de los errores y evitar el guardado
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
  
    // Si es válido, proceder a guardar
    const saveSuccessful = await handleSave();
    if (saveSuccessful) {
      setIsModalConfirmacionOpen(true);
  
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/Registro'); // Cambia '/pagina-destino' por la ruta que desees
      }, 1000); // 2 segundos
    }
  };

  // Limpiar errores cuando el usuario escribe
  const handleInputChange = (e, field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '', // Limpiar el error del campo correspondiente
    }));

    if (field === 'responsable') {
      setResponsable(e.target.value);
    } else if (field === 'estado') {
      setEstado(e.target.value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2 max-h-[90vh] overflow-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Registro de Almacenamiento</h3>
          <button 
            onClick={onClose} 
            className="text-xl hover:text-gray-700"
            disabled={loading}
          >
            X
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <ProductSelect
          options={options}
          value={selectedProducts}
          onChange={handleSelectProduct}
          isDisabled={loading}
        />
        {errors.productos && <p className="text-red-500 text-sm">{errors.productos}</p>}

        <div className="mb-4">
          <EstadoSelect 
            currentStatus={estado} 
            onChange={(value) => handleInputChange({ target: { value } }, 'estado')}
            disabled={loading}
          />
          {errors.estado && <p className="text-red-500 text-sm">{errors.estado}</p>}
        </div>

        {/* Producto y cantidad */}
        <div className="mb-4 overflow-y-auto max-h-[300px]">
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
                      min="1"
                      value={product.quantity || 1}
                      onChange={(e) => handleQuantityChange(e, product.value)}
                      className={`border p-2 rounded w-full ${errors.cantidad ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad}</p>}
          </table>
        </div>

        {/* Campo Responsable */}
        <div className="mb-4">
          <label className="block text-lg mb-2">Responsable</label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => handleInputChange(e, 'responsable')}
            className={`border p-2 w-full rounded ${errors.responsable ? 'border-red-500' : ''}`}
            placeholder="Nombre del responsable"
            disabled={loading}
          />
          {errors.responsable && <p className="text-red-500 text-sm">{errors.responsable}</p>}
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <BotonPrincipal 
            Text={loading ? "Guardando..." : "Guardar"} 
            onClick={handleGuardar}
            disabled={loading}
          />
          <BotonSecundario 
            Text="Cancelar" 
            onClick={onClose}
            disabled={loading}
          />
        </div>
      </div>

      <ModalConfirmacion 
        isOpen={isModalConfirmacionOpen}
        onClose={handleConfirmacionClose}
        message="¡Registro guardado correctamente!"
      />
    </div>
  );
};

export default ModalEntrada;
