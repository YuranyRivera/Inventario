import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PDFExportButton = ({ filteredData, allData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const dataToExport = filteredData.length > 0 ? filteredData : allData;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Traslados', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Fecha de generación: ${fecha}`, 14, 30);

    const tableColumn = [
      'ID',
      'Fecha',
      'Ubicación Inicial',
      'Producto',
      'Código',
      'Ubicación Final',
      'Responsable'
    ];

    const tableRows = dataToExport.map(item => [
      item.id,
      item.fecha,
      item.ubicacion_inicial,
      item.producto,
      item.codigo,
      item.ubicacion_final,
      item.responsable
    ]);

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 163, 5],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 },
        5: { cellWidth: 35 },
        6: { cellWidth: 30 }
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2,
        fontSize: 8
      },
      margin: { top: 10 }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

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