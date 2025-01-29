import React from 'react';

const Table = ({ title, headers, rows, onDelete }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-green-600 mb-4">{title}</h2>
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}> {/* Contenedor con scroll */}
        <table className="min-w-full table-auto rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-[#00A305] text-white">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left">{header}</th>
              ))}
              <th className="px-4 py-2 text-left">Eliminar</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{row.nombre}</td>
                  <td className="px-4 py-2">{row.correo}</td>
                  <td className="px-4 py-2">{row.rol}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#00A305]  text-white py-1 px-3 rounded"
                      onClick={() => onDelete(row.id)} // Llamar a la función onDelete al hacer clic
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={headers.length + 1} className="px-4 py-2 text-center">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
