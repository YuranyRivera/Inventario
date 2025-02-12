import React from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";

const AdminArticlesTable = ({ headers, rows, onEdit, onDelete }) => {
  const generateBarcodePDF = (codigo) => {
    const doc = new jsPDF();
    const canvas = document.createElement("canvas");

    JsBarcode(canvas, codigo, { format: "CODE128" });
    const barcodeImage = canvas.toDataURL("image/png");

    doc.addImage(barcodeImage, "PNG", 10, 20, 50, 20);
    doc.save(`barcode_${codigo}.pdf`);
  };

  return (
    <div className="p-4">
      {/* 🌐 Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full mt-5 bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#00A305] text-white">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left">{header}</th>
              ))}
              <th className="px-4 py-3 text-left">Acciones</th>
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
                  <td key={idx} className="px-4 py-3">{cell}</td>
                ))}
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    onClick={() => onEdit(row, index)}
                    className="bg-[#00A305] text-white py-1 px-3 rounded hover:bg-green-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="bg-white text-[#00A305] py-1 px-3 border border-[#00A305] rounded hover:bg-green-100 transition"
                  >
                    Dar de baja
                  </button>
                  <button
                    onClick={() => generateBarcodePDF(row.codigo)}
                    className="bg-[#00A305] text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                  >
                    Código
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Tarjetas en modo responsive */}
      <div className="block md:hidden space-y-4 mt-5">
        {rows.map((row, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg shadow-md bg-white"
          >
            {Object.entries(row).map(([key, value]) => (
              <p key={key} className="text-gray-700 text-sm">
                <span className="font-semibold capitalize">{key}:</span> {value}
              </p>
            ))}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => onEdit(row, index)}
                className="bg-[#00A305] text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(row)}
                className="bg-white text-[#00A305] py-1 px-3 border border-[#00A305] rounded text-sm hover:bg-green-100 transition"
              >
                Dar de baja
              </button>
              <button
                onClick={() => generateBarcodePDF(row.codigo)}
                className="bg-[#00A305] text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition"
              >
                Código
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminArticlesTable;
