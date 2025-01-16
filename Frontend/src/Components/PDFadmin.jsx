import React from 'react';
import { jsPDF } from 'jspdf';

const PDFExportButton = ({ filteredData, allData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = filteredData.length > 0 ? filteredData : allData;

    // Configurar las columnas específicas para el reporte
    const columns = [
      'ID', 
      'Fecha', 
      'Ubicación Inicial', 
      'Producto', 
      'Ubicación Final', 
      'Responsable'
    ];

    // Preparar los datos específicos para el reporte
    const rows = dataToExport.map(item => [
      item.id,
      item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '',
      item.ubicacion_inicial || '',
      item.producto || '',
      item.ubicacion_final || '',
      item.responsable || ''
    ]);

    // Agregar título
    doc.setFontSize(16);
    doc.text('Reporte de Traslados', 14, 20);

    // Agregar tabla
    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 163, 5],
        textColor: [255, 255, 255]
      }
    });

    // Guardar el PDF
    doc.save('reporte_traslados.pdf');
  };

  return (
    <button 
      className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
      onClick={exportToPDF}
    >
      <i className="fas fa-file-pdf mr-2"></i> PDF
    </button>
  );
};

export default PDFExportButton;
