import React, { useState } from 'react';
import ModalInforme from './ModalInforme';
import ModalConfi from './ModalConf';

const TableEntrada = ({ headers, rows, setRows, reloadArticulos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const handleOpenModal = async (row) => {
    const movimientoId = row[0];
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

  const handleDeleteConfirm = (id) => {
    setDeleteRowId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleteConfirmOpen(false);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/eliminar-movimiento/${deleteRowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el registro');
      
      setRows((prevRows) => prevRows.filter((row) => row[0] !== deleteRowId));
      setDeleteRowId(null);
      
      // Call reloadArticulos after successful deletion
      reloadArticulos();
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      alert('Hubo un error al eliminar el registro.');
    } finally {
      setLoading(false);
    }
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
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleOpenModal(row)}
                  disabled={loading}
                  className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-file-alt mr-2"></i> {loading ? 'Cargando...' : 'Informe'}
                </button>
                <button
                  onClick={() => handleDeleteConfirm(row[0])}
                  disabled={loading}
                  className="bg-red-500 text-white py-1 px-3 rounded flex items-center hover:bg-red-700 transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i> Eliminar
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

      {/* Modal de confirmación para eliminar */}
      <ModalConfi
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="¿Estás seguro de que deseas eliminar este registro?"
      />
    </div>
  );
};

export default TableEntrada;
