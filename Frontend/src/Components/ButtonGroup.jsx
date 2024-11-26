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
        <button className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-700" >
          <i className="fas fa-file-excel mr-2"></i> Excel
        </button>
        <button className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]">
          <i className="fas fa-file-pdf mr-2"></i> PDF
        </button>
        <button
          className="  bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:bg-[#00A305] "
          onClick={() => navigate(isStorageSelected ? '/AgregarAux' : '/AgregarAdmin')}
        >
<span className="text-green-600 hover:text-white py-2 px-1   ">Agregar Artículo</span>
 <i className="fas fa-plus ml-2 text-white bg-[#00A305] p-1 rounded-full hover:text-white   "></i>


        </button>
        {isStorageSelected && (
          <button
            className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
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
