import React, { useState } from 'react';
import ModalRAdm from './ModalR_Adm';   // Importa el modal administrativo
import ModalRAlm from './ModalR_Alm';   // Importa el modal de almacenamiento
import ModalAdmin from './ModalAdmin';  // Importa el modal administrativo
import ModalAlm from './ModalAlm';      // Importa el modal de almacenamiento

const ButtonGroup = ({ isStorageSelected }) => {
  const [isModalEntradaOpen, setIsModalEntradaOpen] = useState(false); // Estado para el modal del reporte
  const [isModalAdminOpen, setIsModalAdminOpen] = useState(false);     // Estado para el modal administrativo
  const [isModalAlmOpen, setIsModalAlmOpen] = useState(false);         // Estado para el modal de almacenamiento

  // Manejar apertura y cierre de modales
  const handleOpenEntradaModal = () => setIsModalEntradaOpen(true);
  const handleCloseEntradaModal = () => setIsModalEntradaOpen(false);

  const handleOpenAdminModal = () => setIsModalAdminOpen(true);
  const handleCloseAdminModal = () => setIsModalAdminOpen(false);

  const handleOpenAlmModal = () => setIsModalAlmOpen(true);
  const handleCloseAlmModal = () => setIsModalAlmOpen(false);

  return (
    <div>
      <div className="flex space-x-4">
        {/* Botón para exportar a Excel */}
        <button className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-700">
          <i className="fas fa-file-excel mr-2"></i> Excel
        </button>

        {/* Botón para exportar a PDF */}
        <button className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]">
          <i className="fas fa-file-pdf mr-2"></i> PDF
        </button>

        {/* Botón para agregar artículo */}
        <button
          className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:bg-[#00A305]"
          onClick={isStorageSelected ? handleOpenAlmModal : handleOpenAdminModal}
        >
          <span className="text-green-600 hover:text-white py-2 px-1">Agregar Artículo</span>
          <i className="fas fa-plus ml-2 text-white bg-[#00A305] p-1 rounded-full"></i>
        </button>

        {/* Botón para reporte, siempre visible */}
        <button
          className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
          onClick={handleOpenEntradaModal}
        >
          Reporte
        </button>
      </div>

      {/* Modal del Reporte - Condicional según selección */}
      {isStorageSelected ? (
        <ModalRAlm isOpen={isModalEntradaOpen} onClose={handleCloseEntradaModal} />
      ) : (
        <ModalRAdm isOpen={isModalEntradaOpen} onClose={handleCloseEntradaModal} />
      )}

      {/* Modal de Administración */}
      <ModalAdmin isOpen={isModalAdminOpen} onClose={handleCloseAdminModal} />

      {/* Modal de Almacenamiento */}
      <ModalAlm isOpen={isModalAlmOpen} onClose={handleCloseAlmModal} />
    </div>
  );
};

export default ButtonGroup;
