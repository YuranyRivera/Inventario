import React, { useState } from 'react';
import ModalInforme from './ModalInforme';

const TableEntrada = ({ headers, rows }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]); // Datos del modal
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleOpenModal = async (row) => {
    const movimientoId = row[0]; // Asumiendo que el ID está en la primera columna
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/movimiento/${movimientoId}`);
      if (!response.ok) throw new Error('Error al obtener los detalles');
      const data = await response.json();
      setModalData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al cargar los detalles:', error);
      alert('Hubo un error al obtener los detalles del movimiento.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData([]);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full mt-10 table-auto rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#00A305] text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">{header}</th>
            ))}
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">{cell}</td>
              ))}
              <td className="px-4 py-2">
                <button
                  onClick={() => handleOpenModal(row)}
                  disabled={loading}
                  className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-file-alt mr-2"></i> {loading ? 'Cargando...' : 'Informe'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para mostrar información detallada */}
      {isModalOpen && (
        <ModalInforme isOpen={isModalOpen} onClose={handleCloseModal} data={modalData} />
      )}
    </div>
  );
};

export default TableEntrada;
