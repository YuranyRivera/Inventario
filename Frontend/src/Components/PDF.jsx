import React from 'react';
import { jsPDF } from 'jspdf';

const PDFExportButton = ({ filteredData, allData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = filteredData.length > 0 ? filteredData : allData;

    // Configurar las columnas específicas para administración
    const columns = [
      'ID', 
      'Fecha', 
      'Descripción', 
      'Proveedor', 
      'Ubicación', 
      'Observación', 
      'Precio'
    ];

    // Preparar los datos específicos para administración
    const rows = dataToExport.map(item => [
      item.id,
      item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '',
      item.descripcion || '',
      item.proveedor || '',
      item.ubicacion || '',
      item.observacion || '',
      typeof item.precio === 'number' ? item.precio.toFixed(2) : '0.00'
    ]);

    // Agregar título
    doc.setFontSize(16);
    doc.text('Reporte Administrativo', 14, 20);

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
    doc.save('reporte_administrativo.pdf');
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
