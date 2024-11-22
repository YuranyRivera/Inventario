import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonGroup = ({ isStorageSelected, onActionClick }) => {
  const navigate = useNavigate();

  // Función para manejar la redirección al agregar artículo
  const handleAddArticuloClick = () => {
    navigate('/AgregarArticulo'); // Redirige a la ruta '/agregar-articulo'
  };

  return (
    <div className="flex space-x-4 mb-6">
      {/* Botones para exportar */}
      <button className="bg-green-600 text-white py-2 px-4 rounded flex items-center">
        <i className="fas fa-file-excel mr-2"></i> Excel
      </button>
      <button className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded flex items-center">
        <i className="fas fa-file-pdf mr-2"></i> PDF
      </button>

      {/* Botón para agregar */}
      <button
        onClick={handleAddArticuloClick}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
      >
        <i className="fas fa-plus mr-2"></i> Agregar Artículo
      </button>

      {/* Botón de acción dinámica */}
      <button
        onClick={onActionClick}
        className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded flex items-center"
      >
        {isStorageSelected ? 'Realizar Tiquete' : 'Filtrar'}
      </button>
    </div>
  );
};

export default ButtonGroup;
