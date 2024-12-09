import React from 'react';
import * as XLSX from 'xlsx'; // Para exportar a Excel
import jsPDF from 'jspdf'; // Para generar PDF
import 'jspdf-autotable'; // Para la tabla en PDF

const ModalInforme = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const headers = ['Fecha de Solicitud', 'Producto/Detalle', 'Cantidad', 'Fecha de Entrega', 'Firma de Entrega'];

  const exportToExcel = () => {
    const worksheetData = [
      headers, // Encabezados
      ...data.map((item) => [
        item.fechaSolicitud,
        item.producto,
        item.cantidad,
        item.fechaEntrega,
        '', // Deja la columna firmaEntrega vacía
      ]),
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Informe Detallado");
    XLSX.writeFile(workbook, "InformeDetallado.xlsx");
  };
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape', // Orientación horizontal
      unit: 'mm',
      format: 'a4',
    });
  
    doc.setFontSize(14);
    doc.text("Informe Detallado", 14, 15); // Título del PDF
  
    const tableColumn = headers;
    const tableRows = data.map((item) => [
      item.fechaSolicitud,
      item.producto,
      item.cantidad,
      item.fechaEntrega,
      '', // Deja la columna firmaEntrega vacía
    ]);
  
    // Agregar tabla al PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        halign: 'center', // Alinear texto al centro
        valign: 'middle', // Alinear verticalmente al centro
      },
      headStyles: {
        fillColor: [0, 163, 5], // Color verde para encabezado
        textColor: [255, 255, 255], // Texto blanco
      },
      margin: { top: 20 },
    });
  
    doc.save("InformeDetallado.pdf"); // Guardar el archivo PDF
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4 overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Informe Detallado</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            ×
          </button>
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

        <table className="min-w-full table-auto rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-[#00A305] text-white">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
              >
                <td className="px-4 py-2">{item.fechaSolicitud}</td>
                <td className="px-4 py-2">{item.producto}</td>
                <td className="px-4 py-2">{item.cantidad}</td>
                <td className="px-4 py-2">{item.fechaEntrega}</td>
                <td className="px-4 py-2">{item.firmaEntrega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalInforme;
