import React, { useState } from 'react';
import ModalRAdm from './ModalR_Adm';   // Modal reporte administrativo
import ModalRAlm from './ModalR_Alm';   // Modal reporte almacenamiento
import ModalAdmin from './ModalAdmin';  // Modal administrativo
import ModalAlm from './ModalAlm';      // Modal almacenamiento

const ButtonGroup = ({ isStorageSelected, onSave }) => {
  const [isModalEntradaOpen, setIsModalEntradaOpen] = useState(false);  // Modal de Reporte
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);          // Modal de Agregar Artículo

  // Funciones para manejar apertura y cierre de modales
  const handleOpenEntradaModal = () => setIsModalEntradaOpen(true);
  const handleCloseEntradaModal = () => setIsModalEntradaOpen(false);

  const handleOpenAddModal = () => setIsModalAddOpen(true);
  const handleCloseAddModal = () => setIsModalAddOpen(false);

  // Función para manejar el guardado y recargar los datos
  const refreshArticulos = () => {
    onSave(); // Recarga los datos
    handleCloseAddModal(); // Cierra el modal
  };

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
          onClick={handleOpenAddModal}
        >
          <span className="text-green-600 hover:text-white py-2 px-1">Agregar Artículo</span>
          <i className="fas fa-plus ml-2 text-white bg-[#00A305] p-1 rounded-full"></i>
        </button>

        {/* Botón para reporte */}
        <button
          className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
          onClick={handleOpenEntradaModal}
        >
          Reporte
        </button>
      </div>

      {/* Modales */}
      {isStorageSelected ? (
        <>
          {/* Modal de Reporte para Almacenamiento */}
          <ModalRAlm isOpen={isModalEntradaOpen} onClose={handleCloseEntradaModal} />
          {/* Modal de Agregar Artículo para Almacenamiento */}
          <ModalAlm
            isOpen={isModalAddOpen}
            onClose={handleCloseAddModal}
            onSave={refreshArticulos}
          />
        </>
      ) : (
        <>
          {/* Modal de Reporte para Administrativos */}
          <ModalRAdm isOpen={isModalEntradaOpen} onClose={handleCloseEntradaModal} />
          {/* Modal de Agregar Artículo para Administrativos */}
          <ModalAdmin
            isOpen={isModalAddOpen}
            onClose={handleCloseAddModal}
            onSave={refreshArticulos}
          />
        </>
      )}
    </div>
  );
};

export default ButtonGroup;
