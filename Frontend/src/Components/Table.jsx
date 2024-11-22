import React from 'react';

const Table = ({ title, headers }) => {
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
          {/* Fila vacía de ejemplo */}
          <tr className="border-t">
            {headers.map((_, idx) => (
              <td key={idx} className="px-4 py-2">-</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
