import React, { useState } from 'react';
import CategorySelect from './CategorySelect'; // Importa el componente

const ModalAdmin = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

  const headers = ['Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Acciones'];
  const [rows, setRows] = useState([
    { fecha: '2024-11-22', descripcion: 'Descripción del artículo', ubicacion: '', proveedor: '', observacion: '' },
  ]);

  // Agregar una nueva fila vacía
  const handleAddRow = () => {
    setRows([...rows, { fecha: '', descripcion: '', ubicacion: '', proveedor: '', observacion: '' }]);
  };

  // Manejar cambios en las celdas de una fila
  const handleRowChange = (value, rowIndex, field) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  // Guardar todas las filas
  const handleSave = () => {
    console.log('Artículos guardados:', rows);
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[80%] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Artículos Administrativos</h2>

        <div className="bg-white p-4 rounded-lg">
          <table className="min-w-full table-auto rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-[#00A305] text-white">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.fecha}
                      onChange={(e) => handleRowChange(e.target.value, rowIndex, 'fecha')}
                      className="border px-2 py-1 w-full"
                      placeholder="Fecha"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.descripcion}
                      onChange={(e) => handleRowChange(e.target.value, rowIndex, 'descripcion')}
                      className="border px-2 py-1 w-full"
                      placeholder="Descripción"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.proveedor}
                      onChange={(e) => handleRowChange(e.target.value, rowIndex, 'proveedor')}
                      className="border px-2 py-1 w-full"
                      placeholder="Proveedor"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <CategorySelect
                      value={row.ubicacion}
                      onChange={(value) => handleRowChange(value, rowIndex, 'ubicacion')}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.observacion}
                      onChange={(e) => handleRowChange(e.target.value, rowIndex, 'observacion')}
                      className="border px-2 py-1 w-full"
                      placeholder="Observación"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    {rowIndex === rows.length - 1 && (
                      <button
                        onClick={handleAddRow}
                        className="bg-[#00A305] text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <i className="fas fa-plus"></i> Agregar Fila
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[#00A305] text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdmin;
