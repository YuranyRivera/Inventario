import React, { useState } from 'react';

const ModalAlm = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

  const headers = ['Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Acciones'];
  const [rows, setRows] = useState([
    { modulo: '', estante: '', cantidad: '', producto: '', estado: '' },
  ]);

  // Agregar una nueva fila vacía
  const handleAddRow = () => {
    setRows([...rows, { modulo: '', estante: '', cantidad: '', producto: '', estado: '' }]);
  };

  // Manejar cambios en las celdas de una fila
  const handleRowChange = (e, rowIndex, field) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: e.target.value } : row
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
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Artículos de Almacenamiento</h2>

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
                      value={row.modulo}
                      onChange={(e) => handleRowChange(e, rowIndex, 'modulo')}
                      className="border px-2 py-1 w-full"
                      placeholder="Módulo"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.estante}
                      onChange={(e) => handleRowChange(e, rowIndex, 'estante')}
                      className="border px-2 py-1 w-full"
                      placeholder="Estante"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.cantidad}
                      onChange={(e) => handleRowChange(e, rowIndex, 'cantidad')}
                      className="border px-2 py-1 w-full"
                      placeholder="Cantidad"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.producto}
                      onChange={(e) => handleRowChange(e, rowIndex, 'producto')}
                      className="border px-2 py-1 w-full"
                      placeholder="Producto/Detalle"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.estado}
                      onChange={(e) => handleRowChange(e, rowIndex, 'estado')}
                      className="border px-2 py-1 w-full"
                      placeholder="Estado"
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

export default ModalAlm;
