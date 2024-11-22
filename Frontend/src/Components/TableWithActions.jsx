
import React from 'react';

const TableWithActions = ({ title, headers, rows, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-green-600 mb-4">{title}</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-[#00A305] text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t">
              {row.map((cell, idx) => (
                <td key={idx} className="px-4 py-2">{cell}</td>
              ))}
              <td className="px-4 py-2 flex space-x-2">
                {/* Botón de Editar (verde con icono blanco) */}
                <button 
                  onClick={() => onEdit(row)} 
                  className="bg-green-600 text-white py-1 px-3 rounded flex items-center"
                >
                  <i className="fas fa-pencil-alt mr-2"></i> Editar
                </button>

                {/* Botón de Eliminar (blanco con borde verde y icono verde) */}
                <button 
                  onClick={() => onDelete(row)} 
                  className="bg-white text-green-600 py-1 px-3 border-2 border-green-600 rounded flex items-center"
                >
                  <i className="fas fa-trash-alt mr-2"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWithActions;
