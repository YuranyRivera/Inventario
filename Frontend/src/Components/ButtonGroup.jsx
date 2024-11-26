import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalTiquete from './ModalTiquete';  // Asegúrate de importar el modal aquí

const ButtonGroup = ({ isStorageSelected, onActionClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <div>
      <div className="flex space-x-4">
        <button className="bg-green-600 text-white py-2 px-4 rounded">
          <i className="fas fa-file-excel mr-2"></i> Excel
        </button>
        <button className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded">
          <i className="fas fa-file-pdf mr-2"></i> PDF
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded"
          onClick={() => navigate(isStorageSelected ? '/AgregarAux' : '/AgregarAdmin')}
        >
          <i className="fas fa-plus mr-2"></i> Agregar Artículo
        </button>
        {isStorageSelected && (
          <button
            className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded"
            onClick={handleOpenModal} // Muestra el modal al hacer clic
          >
            Hacer Tiquete
          </button>
        )}
      </div>

      {/* ModalTiquete */}
      <ModalTiquete isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ButtonGroup;
