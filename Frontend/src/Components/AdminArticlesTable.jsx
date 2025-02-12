import React from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";

const AdminArticlesTable = ({
  headers,
  rows,
  onEdit,
  onDelete,
  editingRowIndex,
  editedRowData,
  handleInputChange,
  handleSave,
  handleCancel,
}) => {
  const disabledFields = ["id", "fecha_creacion"];

  // Función para generar el código de barras en PDF
  const generateBarcodePDF = (codigo) => {
    const doc = new jsPDF();
    const canvas = document.createElement("canvas");

    // Generar código de barras
    JsBarcode(canvas, codigo, { format: "CODE128" });

    // Convertir a imagen
    const barcodeImage = canvas.toDataURL("image/png");

    // Agregar imagen al PDF

    doc.addImage(barcodeImage, "PNG", 10, 20, 50, 20);
    
    // Guardar PDF
    doc.save(`barcode_${codigo}.pdf`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="hidden md:table min-w-full mt-10 table-auto rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#00A305] text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">{header}</th>
            ))}
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`border-t ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-gray-200 transition-colors`}
            >
              {Object.values(row).map((cell, idx) => (
                <td key={idx} className="px-4 py-2">{cell}</td>
              ))}
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => onEdit(row, index)}
                  className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-pencil-alt mr-2"></i> Editar
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="bg-white text-[#00A305] py-1 px-3 border-2 border-[#00A305] rounded flex items-center hover:bg-green-100 transition-colors"
                >
                  <i className="fas fa-trash-alt mr-2"></i> Dar de baja
                </button>
                <button
                  onClick={() => generateBarcodePDF(row.codigo)}
                  className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-barcode mr-2"></i> Generar Código
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminArticlesTable
