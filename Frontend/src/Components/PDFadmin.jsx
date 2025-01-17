import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PDFExportButton = ({ filteredData, allData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const dataToExport = filteredData.length > 0 ? filteredData : allData;

    // Definir las columnas para el PDF
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Ubicación Inicial', dataKey: 'ubicacion_inicial' },
      { header: 'Producto', dataKey: 'producto' },
      { header: 'Ubicación Final', dataKey: 'ubicacion_final' },
      { header: 'Responsable', dataKey: 'responsable' },
    ];

    // Transformar los datos en formato aceptado por autoTable
    const rows = dataToExport.map((item) => ({
      id: item.id || '',
      fecha: item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '',
      ubicacion_inicial: item.ubicacion_inicial || '',
      producto: item.producto || '',
      ubicacion_final: item.ubicacion_final || '',
      responsable: item.responsable || '',
    }));

    // Agregar encabezado con imagen y título
    const imagePath = '/Img/encabezado.png';
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const imgWidth = 190; // Ajusta el ancho según el diseño del encabezado
      const imgHeight = (img.height * imgWidth) / img.width;
      const x = (doc.internal.pageSize.width - imgWidth) / 2; // Centrar la imagen
      const y = 10;

      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);

      // Título del reporte
      const titleY = y + imgHeight + 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Traslados', doc.internal.pageSize.width / 2, titleY, { align: 'center' });

      // Tabla de datos
      doc.autoTable({
        startY: titleY + 15,
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
        theme: 'striped',
        headStyles: {
          fillColor: [0, 163, 5],
          textColor: [255, 255, 255],
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          halign: 'center',
          valign: 'middle',
        },
      });

      // Guardar el archivo
      doc.save('reporte_traslados.pdf');
    };
  };

  return (
    <button
      className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305]"
      onClick={exportToPDF}
    >
      <i className="fas fa-file-pdf mr-2"></i> Generar PDF
    </button>
  );
};

export default PDFExportButton;
