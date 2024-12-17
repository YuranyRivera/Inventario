// ExcelExportButton.js
import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ filteredData, allData }) => {
  const exportToExcel = () => {
    const dataToExport = filteredData.length > 0 ? filteredData : allData;

    // Preparar los datos para el Excel
    const rows = dataToExport.map(item => ({
      ID: item.id,
      'Producto/Detalle': item.producto,
      'Cantidad Inicial': item.cantidad_productos,
      'Módulo': item.modulo,
      'Estante': item.estante,
      'Estado': item.estado,
      Entrada: item.entrada,
      Salida: item.salida,
      Restante: item.cantidad,
    }));

    // Crear un libro de trabajo y una hoja
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Artículos');

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'articulos.xlsx');
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-700"
    >
      <i className="fas fa-file-excel mr-2"></i> Excel
    </button>
  );
};

export default ExcelExportButton;
