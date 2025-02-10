import React from 'react';

const AuxMaintenanceTable = ({ 
  headers,
  rows,
  onEdit,
  onDelete,
  editingRowIndex,
  editedRowData,
  handleInputChange,
  handleSave,
  handleCancel,
}) => {
  const disabledFields = ['id', 'cantidad', 'cantidad_productos'];

  return (
    <div className="overflow-x-auto">
    <table className="w-full table-auto rounded-lg mt-10 overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#00A305] text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left whitespace-nowrap">
                {header}
              </th>
            ))}
            <th className="px-4 py-2 text-left whitespace-nowrap">Acciones</th>
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
              {index === editingRowIndex ? (
                // Inputs para edición
                Object.entries(row).map(([key, value], idx) => {
                  const field = key.toLowerCase();
                  const isDisabled = disabledFields.includes(field);
                  return (
                    <td key={idx} className="px-4 py-2">
                      {field === 'motivo_baja' ? (
                        <textarea
                          value={editedRowData[field] || ''}
                          onChange={(e) => handleInputChange(e, field)}
                          disabled={isDisabled}
                          className={`border px-2 py-1 rounded w-full min-h-[100px] ${
                            isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                          }`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedRowData[field] || ''}
                          onChange={(e) => handleInputChange(e, field)}
                          disabled={isDisabled}
                          className={`border px-2 py-1 rounded w-full ${
                            isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                          }`}
                        />
                      )}
                    </td>
                  );
                })
              ) : (
                // Mostrar datos
                Object.entries(row).map(([key, value], idx) => (
                  <td key={idx} className="px-4 py-2">
                    <div className={`${
                      key === 'motivo_baja' 
                        ? 'max-h-[150px] overflow-y-auto break-words' 
                        : 'whitespace-normal break-words'
                    } max-w-[300px]`}>
                      {value}
                    </div>
                  </td>
                ))
              )}
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex space-x-2">
                  {index === editingRowIndex ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                      >
                        <i className="fas fa-save mr-2"></i> Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white py-1 px-3 rounded flex items-center hover:bg-red-700 transition-colors"
                      >
                        <i className="fas fa-times mr-2"></i> Cancelar
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => onDelete(row)}
                      className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuxMaintenanceTable;