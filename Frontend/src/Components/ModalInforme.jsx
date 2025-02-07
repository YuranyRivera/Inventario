import React from 'react';
import * as XLSX from 'xlsx'; // Para exportar a Excel
import jsPDF from 'jspdf'; // Para generar PDF
import 'jspdf-autotable'; // Para la tabla en PDF

const ModalInforme = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const headers = ['FECHA DE SOLICITUD', 'DESCRIPCION DEL PRODUCTO', 'CANTIDAD', 'FECHA DE ENTREGA', 'FIRMA DE ENTREGA'];

  const exportToExcel = () => {
    const worksheetData = [
      headers, // Encabezados
      ...data.map((item) => [
        item.fechaSolicitud,
        item.producto, // Nombre del producto
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
  
    // Ruta de la imagen (asegurarse que esté en la carpeta public/Img)
    const imagePath = '/Img/encabezado.png';
  
    // Cargar la imagen en el PDF
    doc.setFontSize(14);
  
    // Agregar la imagen centrada
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const imgWidth = 190; // Ancho de la imagen en mm (ajusta según sea necesario)
    const imgHeight = (img.height * imgWidth) / img.width; // Ajustar altura proporcionalmente
    const x = (doc.internal.pageSize.width - imgWidth) / 2; // Centrar la imagen horizontalmente
    const y = 10; // Cambié la posición vertical para que la imagen esté más arriba

  
      // Agregar la imagen
      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
  
      // Título debajo de la imagen
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const titleY = y + imgHeight + 10; // Posición del título
      doc.text("ORDEN DE REQUERIMIENTO DE PRODUCTOS DEL ALMACÉN", doc.internal.pageSize.width / 2, titleY, {
        align: 'center',
      });
  
      // Texto con el nombre de la persona y la fecha al lado izquierdo, alineado con la tabla
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const personaY = titleY + 10; // Ajustar distancia entre el título y el texto
      const personaTexto = `NOMBRE DE LA PERSONA QUE SOLICITA EL PRODUCTO: ${data[0]?.firmaEntrega || 'N/A'} (${data[0]?.fechaSolicitud || 'N/A'})`;
  
      // Agregar texto al lado izquierdo, alineado con la tabla
      const leftMargin = 15; // Alineación del texto con el margen izquierdo de la tabla
      doc.text(personaTexto, leftMargin, personaY);
  
      const tableColumn = headers;
      const tableRows = data.map((item) => [
        item.fechaSolicitud,
        item.producto, // Nombre del producto
        item.cantidad,
        item.fechaEntrega,
        '', // Deja la columna firmaEntrega vacía
      ]);
    
      // Agregar tabla al PDF, reduciendo la distancia entre el texto y la tabla
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: personaY + 5, // Reducir la distancia entre el texto y la tabla
        styles: {
          halign: 'center', // Alinear texto al centro
          valign: 'middle', // Alinear verticalmente al centro
          fontSize: 10, // Tamaño de la letra
          lineWidth: 0.1, // Grosor de las líneas de la tabla
        },
        headStyles: {
          fillColor: [0, 163, 5], // Fondo verde para el encabezado
          textColor: [255, 255, 255], // Texto blanco en el encabezado
          lineWidth: 0.5, // Grosor de las líneas del encabezado
          fontSize: 10, // Tamaño de la letra del encabezado
        },
        margin: { top: 10 },
      });
  
      doc.save("InformeDetallado.pdf"); // Guardar el archivo PDF
    };
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
                <td className="px-4 py-2">{item.producto}</td> {/* Mostrar nombre del producto */}
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
