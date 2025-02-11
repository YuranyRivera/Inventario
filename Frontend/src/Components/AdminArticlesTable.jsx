import React from 'react';

const AdminArticlesTable = ({
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
  // Lista de campos deshabilitados (puedes ajustarlos según sea necesario)
  const disabledFields = ['id', 'fecha_creacion'];

  return (
    <div className="overflow-x-auto">
      <table className="hidden md:table min-w-full mt-10 table-auto rounded-lg overflow-hidden shadow-lg">
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
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              } hover:bg-gray-200 transition-colors`}
            >
              {index === editingRowIndex ? (
                // Mostrar inputs para editar
                Object.entries(row).map(([key, value], idx) => {
                  const field = key.toLowerCase();
                  const isDisabled = disabledFields.includes(field);
                  return (
                    <td key={idx} className="px-4 py-2">
                      <input
                        type="text"
                        value={editedRowData[field] || ''}
                        onChange={(e) => handleInputChange(e, field)}
                        disabled={isDisabled}
                        className={`border px-2 py-1 rounded w-full ${
                          isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                      />
                    </td>
                  );
                })
              ) : (
                // Mostrar datos de la fila
                Object.values(row).map((cell, idx) => (
                  <td key={idx} className="px-4 py-2">
                    {cell}
                  </td>
                ))
              )}
              <td className="px-4 py-2 flex space-x-2">
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
                  <>
                    <button
                      onClick={() => onEdit(row, index)}
                      className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                    >
                      <i className="fas fa-pencil-alt mr-2"></i> Editar
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Dar de baja
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 shadow-md ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            {Object.entries(row).map(([key, value], idx) => (
              <div key={idx} className="mb-2">
                <p className="text-sm font-semibold text-gray-700 capitalize">
                  {headers[idx]}:
                </p>
                {index === editingRowIndex && !disabledFields.includes(key) ? (
                  <input
                    type="text"
                    value={editedRowData[key] || ''}
                    onChange={(e) => handleInputChange(e, key)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  <p className="text-gray-800">{value}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-4">
              {index === editingRowIndex ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white py-1 px-3 rounded flex items-center hover:bg-red-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onEdit(row, index)}
                    className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
                  >
                    Dar de baja
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminArticlesTable;
