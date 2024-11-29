import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalInforme from './ModalInforme'; // Importamos el ModalInforme

const CustomTable = ({ headers, rows }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRows, setModalRows] = useState([]); // Estado para las filas del modal

  const handleOpenModal = (row) => {
    // Aquí puedes pasar las filas específicas que deseas mostrar en el modal
    setModalRows(row); // Asumiendo que cada fila es un array de celdas
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalRows([]); // Limpiar filas cuando se cierra el modal
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full mt-10 table-auto rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#00A305] text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">
                {header}
              </th>
            ))}
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">{cell}</td>
              ))}
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleOpenModal(row)} // Abre el modal con los datos de la fila
                  className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-file-alt mr-2"></i> Informe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Informe */}
      <ModalInforme
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        headers={['Fecha De Solicitud', 'Descripcion del producto', 'Cantidad', 'Fecha de entrega', 'Firma de entrega']}
        rows={modalRows}
      />
    </div>
  );
};

export default CustomTable;
