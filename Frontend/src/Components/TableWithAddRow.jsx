// TableWithAddRow.jsx
import React, { useState } from 'react';

const TableWithAddRow = ({ headers, initialRows, onSave, onDevolver }) => {
  const [rows, setRows] = useState(initialRows);

  // Agregar una nueva fila vacía
  const handleAddRow = () => {
    setRows([...rows, { item: '', fecha: '', descripcion: '', ubicacion: '', estado: '' }]);
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
    onSave(rows);
    console.log("Filas guardadas:", rows);
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <table className="min-w-full table-auto border border-gray-300 shadow-lg ">
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
                  value={row.item}
                  onChange={(e) => handleRowChange(e, rowIndex, 'item')}
                  className="border px-2 py-1 w-full"
                  placeholder="Artículo"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.fecha}
                  onChange={(e) => handleRowChange(e, rowIndex, 'fecha')}
                  className="border px-2 py-1 w-full"
                  placeholder="Fecha"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.descripcion}
                  onChange={(e) => handleRowChange(e, rowIndex, 'descripcion')}
                  className="border px-2 py-1 w-full"
                  placeholder="Descripción"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.ubicacion}
                  onChange={(e) => handleRowChange(e, rowIndex, 'ubicacion')}
                  className="border px-2 py-1 w-full"
                  placeholder="Ubicación"
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
                {/* Mostrar el botón "Agregar Fila" solo en la última fila dentro de la columna de "Acciones" */}
                {rowIndex === rows.length - 1 && (
                  <button
                    onClick={handleAddRow}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
  );
};

export default TableWithAddRow;
