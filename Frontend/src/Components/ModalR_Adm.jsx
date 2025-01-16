import React, { useState } from 'react';
import Select from 'react-select';
import BotonPrincipal from './Boton';
import BotonSecundario from './BotonSecundario';

const ModalSalida = ({ isOpen, onClose }) => {
  const [ubicacionInicial, setUbicacionInicial] = useState('');
  const [ubicacionFinal, setUbicacionFinal] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [solicitante, setSolicitante] = useState('');
  const [fecha, setFecha] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Datos de ejemplo para ubicaciones
  const ubicaciones = [
    { value: 'Sala Estudiantes', label: 'Sala Estudiantes' },
    { value: 'Sala profesores', label: 'Sala profesores' },
    // Agregar más ubicaciones si es necesario
  ];

  // Función para manejar el cambio de la ubicación inicial
  const handleUbicacionInicialChange = async (selectedOption) => {
    setUbicacionInicial(selectedOption.value);
    setUbicacionFinal(''); // Reset ubicacionFinal cuando cambia la ubicacionInicial
    setSelectedProducts([]); // Reset productos cuando cambia ubicacionInicial
  
    try {
      const response = await fetch(`http://localhost:4000/api/productos/${selectedOption.value}`);
      const data = await response.json();
  
      // Si la respuesta contiene productos, actualizamos el estado de productosDisponibles
      if (Array.isArray(data) && data.length > 0) {
        setProductosDisponibles(data.map(producto => ({
          value: producto.id,
          label: `${producto.id} - ${producto.descripcion}`  // Concatenamos id y descripcion
        })));
      } else {
        setProductosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleUbicacionFinalChange = (selectedOption) => {
    setUbicacionFinal(selectedOption.value);
  };

  const handleSelectProduct = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleSave = async () => {
    // Iterar sobre los productos seleccionados para crear un traslado por cada uno
    try {
      for (const product of selectedProducts) {
        const trasladoData = {
          ubicacion_inicial: ubicacionInicial,
          id_articulo: product.value,  // Usamos product.value para el id_articulo
          ubicacion_final: ubicacionFinal,
          fecha: fecha,
          responsable: solicitante,
        };
  
        // Enviar una solicitud POST para cada producto
        const response = await fetch('http://localhost:4000/api/traslados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trasladoData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error al registrar el traslado:', errorData.error);
          return; // Detener si hay un error
        }
      }
  
      console.log('Todos los traslados registrados con éxito');
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto p-6 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold">Registro de Salida</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Ubicación inicial */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2">Ubicación inicial</label>
            <Select
              options={ubicaciones}
              onChange={handleUbicacionInicialChange}
              placeholder="Seleccionar ubicación inicial..."
            />
          </div>

          {/* Productos */}
          {ubicacionInicial && (
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2">Selecciona los productos</label>
              <Select
                isMulti
                options={productosDisponibles}
                value={selectedProducts}
                onChange={handleSelectProduct}
                placeholder="Seleccionar productos..."
                closeMenuOnSelect={false}
              />
            </div>
          )}

          {/* Tabla de productos seleccionados */}
          {selectedProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium">
                      Producto
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedProducts.map((product) => (
                    <tr key={product.value}>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                        {product.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ubicación final */}
          {ubicacionInicial && (
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2">Ubicación final</label>
              <Select
                options={ubicaciones}
                value={ubicacionFinal ? { value: ubicacionFinal, label: ubicacionFinal } : null}
                onChange={handleUbicacionFinalChange}
                placeholder="Seleccionar ubicación final..."
              />
            </div>
          )}

          {/* Solicitante */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2">Solicitante</label>
            <input
              type="text"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              className="border rounded w-full p-2 sm:p-3 text-sm sm:text-base"
              placeholder="Nombre del solicitante"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-2">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border rounded w-full p-2 sm:p-3 text-sm sm:text-base"
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
