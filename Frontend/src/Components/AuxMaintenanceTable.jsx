import React from 'react';

const AuxMaintenanceTable = ({ headers, rows, onEdit, onDelete }) => {
  return (
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
        {rows.map((row, index) => (
          <tr
            key={index}
            className={`border-t ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'
            } hover:bg-gray-200 transition-colors`}
          >
            {row.map((cell, idx) => (
              <td key={idx} className="px-4 py-2">
                {cell}
              </td>
            ))}
            <td className="px-4 py-2 flex space-x-2">
              <button
                onClick={() => onEdit(row)}
                className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-pencil-alt mr-2"></i> Editar
              </button>
              <button
                onClick={() => onDelete(row)}
                className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
              >
                <i className="fas fa-trash-alt mr-2"></i> Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AuxMaintenanceTable;
