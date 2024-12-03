import React from 'react';

// Funciones de exportación a PDF y Excel (simulación)
const exportToExcel = () => {
  console.log("Exportar a Excel");
  // Lógica para exportar a Excel
};

const exportToPDF = () => {
  console.log("Exportar a PDF");
  // Lógica para exportar a PDF
};

const ModalInforme = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Datos de ejemplo para las filas
  const headers = ['Fecha De Solicitud', 'Producto/Detalle', 'Cantidad', 'Fecha de entrega', 'Firma de entrega'];
  const rows = [
    ['2024-11-01', 'Laptop Dell XPS 13', '1', '2024-11-05', ''],
    ['2024-11-03', 'Monitor Samsung 24"', '2', '2024-11-10', ''],
    ['2024-11-05', 'Teclado Mecánico Logitech', '5', '2024-11-12', ''],
    ['2024-11-07', 'Mouse Razer DeathAdder', '3', '2024-11-14', ''],
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4 overflow-auto max-h-[80vh]">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Informe</h3>
          <button onClick={onClose} className="text-xl">X</button>
        </div>

        {/* Botones de exportación */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={exportToExcel}
            className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-700"
          >
            <i className="fas fa-file-excel mr-2"></i> Excel
          </button>

          <button
            onClick={exportToPDF}
            className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
          >
            <i className="fas fa-file-pdf mr-2"></i> PDF
          </button>
        </div>

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
            {rows.length > 0 &&
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`border-t ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                  {Array.isArray(row) &&
                    row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2">{cell}</td>
                    ))}
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => console.log('Editar', row)}
                      className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                    >
                      <i className="fas fa-pencil-alt mr-2"></i> Editar
                    </button>
                    <button
                      onClick={() => console.log('Eliminar', row)}
                      className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalInforme;
