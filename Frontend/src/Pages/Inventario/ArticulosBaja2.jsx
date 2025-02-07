

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Search, Image as ImageIcon } from 'lucide-react';
import DateInput from '../../Components/DateInput';
import DashboardLayout from '../../Layouts/DashboardLayout';
import TablaArt from '../../Components/TablaArt';
import '@dotlottie/player-component';
import ModalConfi from '../../Components/ModalConf';
import ModalConfirmacion from '../../Components/ModalConfirmacion';
const HistorialBajas = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('bajas2');
  const headers = ['ID', 'Artículo', 'Motivo de Baja', 'Fecha de Baja', 'Usuario', 'Imagen', 'Exportar'];
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);

  const ImageModal = ({ url, onClose }) => {
    if (!url) return null;
    
    return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="relative bg-white p-10 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
    {/* Botón "X" en la esquina superior derecha */}
    <button 
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* Contenido del modal */}
    <img src={url} alt="Imagen de baja" className="max-w-full h-auto" />

  </div>
</div>
    );
  };

  const filteredRows = rows.filter((row) => {
    // Search term filtering
    const searchFields = [
      row[1] || '', // Artículo (index 1)
      row[2] || '', // Motivo (index 2)
      row[4] || '', // Usuario (index 4)
    ];
    
    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Date filtering
    let rowDate = row[3] ? new Date(row[3].split('/').reverse().join('-')) : null;
    let fromDateObj = fromDate ? new Date(fromDate) : null;
    let toDateObj = toDate ? new Date(toDate) : null;

    if (rowDate) rowDate.setHours(0, 0, 0, 0);
    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(0, 0, 0, 0);

    const matchesFromDate = !fromDateObj || (rowDate && rowDate >= fromDateObj);
    const matchesToDate = !toDateObj || (rowDate && rowDate <= toDateObj);

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Obtener datos desde la API
  useEffect(() => {
    const fetchHistorialBajas = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const response = await fetch('https://inventarioschool-v1.onrender.com/api/articulos-baja-historial');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        const mappedRows = data.map((item) => [
          item.id,
          item.producto,
          item.motivo_baja,
          formatDate(item.fecha_baja),
          item.usuario_baja,
          item.imagen_baja ? (
            <button
              onClick={() => setSelectedImage(item.imagen_baja)}
              className="flex items-center justify-center gap-2 text-[#00A305] hover:text-[#00A305]"
            >
              <ImageIcon size={20} />
              Ver imagen
            </button>
          ) : (
            <span className="text-gray-400">Sin imagen</span>
          ),
          <button
            onClick={() => handleRowPDF([
              item.id, item.producto, item.motivo_baja, formatDate(item.fecha_baja), item.usuario_baja, item.imagen_baja
            ])}
            className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-[#00A305]"
          >
            PDF
          </button>
        ]);
        setRows(mappedRows);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setIsLoading(false);
      }
    };
  
    fetchHistorialBajas();
  }, [isLoading]); // Se ejecutará nuevamente cuando isLoading cambie
  

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    
    switch(value) {
      case 'general':
        navigate('/registro');
        break;
      case 'traslados':
        navigate('/moduloadmin');
        break;
      case 'bajas':
        navigate('/articulosbaja');
        break;
      case 'bajas2':
        navigate('/articulosbaja2');
        break;
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

// Filtramos las columnas y filas para excluir las dos últimas columnas
const columns = headers
.slice(0, headers.length - 2) // Excluye las dos últimas columnas
.map((header, index) => ({
  header: header,
  dataKey: index,
}));

const filteredRows = rows.map(row => row.slice(0, row.length - 2));

    const imagePath = '/Img/encabezado.png';
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const imgWidth = 190;
      const imgHeight = (img.height * imgWidth) / img.width;
      const x = (doc.internal.pageSize.width - imgWidth) / 2;
      const y = 10;

      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);

      const titleY = y + imgHeight + 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Historial de Artículos Dados de Baja', doc.internal.pageSize.width / 2, titleY, { align: 'center' });

      doc.autoTable({
        startY: titleY + 15,
        head: [columns.map((col) => col.header)],
        body: filteredRows,
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
      
      doc.save('historial_bajas.pdf');
    };
};


  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...filteredRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');
    XLSX.writeFile(workbook, 'historial_bajas.xlsx');
  };
 
  const handleRowPDF = (row) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
    const imagePath = '/Img/encabezado.png';
    const imgHeader = new Image();
    imgHeader.src = imagePath;
  
    imgHeader.onload = () => {
      // Agregar encabezado con imagen
      const imgWidth = 190;
      const imgHeight = (imgHeader.height * imgWidth) / imgHeader.width;
      const x = (doc.internal.pageSize.width - imgWidth) / 2;
      const y = 10;
  
      doc.addImage(imgHeader, 'PNG', x, y, imgWidth, imgHeight);
  
      const titleY = y + imgHeight + 10;
  
      // Título del reporte
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 163, 5); // Verde profesional
      doc.text('Reporte de Baja', 105, titleY, { align: 'center' });
      doc.setDrawColor(0, 163, 5);
      doc.line(20, titleY + 5, 190, titleY + 5); // Línea debajo del título
  
      // Datos del reporte
      const columns = ['ID', 'Artículo', 'Motivo de Baja', 'Fecha de Baja', 'Usuario'];
      const startY = titleY + 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0); // Negro para el texto
  
      columns.forEach((col, index) => {
        const yPosition = startY + (index * 10);
        doc.setTextColor(0, 163, 5); // Verde para los títulos
        doc.text(`${col}:`, 20, yPosition);
        doc.setTextColor(0, 0, 0); // Negro para los valores
        doc.text(`${row[index]}`, 60, yPosition);
      });
  
      // Imagen del artículo (si está disponible)
      if (row[5] && typeof row[5] === 'string') {
        const img = new Image();
        img.src = row[5];
  
        img.onload = () => {
          doc.setFontSize(12);
          doc.setTextColor(0, 163, 5);
          doc.text('Imagen:', 20, startY + (columns.length * 10) + 10);
          doc.addImage(img, 'PNG', 20, startY + (columns.length * 10) + 15, 100, 70); // Imagen alineada
          doc.save(`baja_${row[0]}.pdf`);
        };
  
        img.onerror = () => {
          // Si ocurre un error al cargar la imagen
          doc.setFontSize(12);
          doc.setTextColor(255, 0, 0); // Rojo para advertencia
          doc.text('Imagen: No disponible', 20, startY + (columns.length * 10) + 10);
          doc.save(`baja_${row[0]}.pdf`);
        };
      } else {
        // Si no hay imagen
        doc.setFontSize(12);
        doc.setTextColor(255, 0, 0); // Rojo para advertencia
        doc.text('Imagen: No disponible', 20, startY + (columns.length * 10) + 10);
        doc.save(`baja_${row[0]}.pdf`);
      }
    };

  imgHeader.onerror = () => {
    alert('Error cargando la imagen de encabezado.');
  };
};

const handleDeleteClick = (row) => {
  setSelectedRowToDelete(row);
  setShowDeleteConfirmation(true);
};
const handleConfirmDelete = async () => {
  setIsLoading(true); // Mostrar el loader
  const id = selectedRowToDelete[0];
  try {
    const response = await fetch(`https://inventarioschool-v1.onrender.com/api/articulos_baja_historial/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el artículo');
    }

    // Esperar 1 segundo antes de volver a cargar los datos
    setTimeout(async () => {
      await fetchHistorialBajas(); // Recargar la lista de artículos
      setIsLoading(false); // Ocultar el loader
    }, 1000);
    
    setShowDeleteConfirmation(false);
  } catch (error) {
    console.error('Error al eliminar el artículo:', error);
    setIsLoading(false); // Asegurar que el loader se oculta en caso de error
  }
};



  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <dotlottie-player
            src="https://lottie.host/0aca447b-d3c9-46ed-beeb-d4481815915a/qvvqgKAKQU.lottie"
            background="transparent"
            speed="1"
            style={{ width: '300px', height: '300px' }}
            loop
            autoplay
          />
        </div>
      ) : (
        <div className="mb-6 m-5">
          <h1 className="text-3xl font-bold text-center text-black mb-10">
            Historial de Artículos Dados de Baja
          </h1>
          <div className="flex gap-6 mt-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="navigation"
                value="general"
                checked={selectedOption === 'general'}
                onChange={handleOptionChange}
                className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
              />
              <span className="text-gray-700">General</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="navigation"
                value="traslados"
                checked={selectedOption === 'traslados'}
                onChange={handleOptionChange}
                className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
              />
              <span className="text-gray-700">Traslados</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="navigation"
                value="bajas"
                checked={selectedOption === 'bajas'}
                onChange={handleOptionChange}
                className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
              />
    <span className="text-gray-700">Historial de bajas-Administración</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      name="navigation"
      value="bajas2"
      checked={selectedOption === 'bajas2'}
      onChange={handleOptionChange}
      className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
    />
                <span className="text-gray-700">Historial de bajas-Almacenamiento</span>
  
  </label>
          </div>

          <div className="space-y-4">
            {/* Search and export buttons */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por artículo, motivo, usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-1">
                <button
                  onClick={exportToPDF}
                  className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded hover:text-white hover:bg-[#00A305] whitespace-nowrap"
                >
                  <i className="fas fa-file-pdf mr-2"></i> PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-700 whitespace-nowrap"
                >
                  <i className="fas fa-file-excel mr-2"></i> Excel
                </button>
              </div>
            </div>

            {/* Date filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Desde
                </label>
                <DateInput 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hasta
                </label>
                <DateInput 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <TablaArt
  headers={headers}
  rows={filteredRows}
  showActions={true} // Cambia esto a true para mostrar la columna de acciones
  onDelete={handleDeleteClick}
/>

              {/* Modal para mostrar la imagen */}
              <ImageModal 
            url={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />

             {/* Delete Confirmation Modal */}
             <ModalConfi
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={handleConfirmDelete}
            message="¿Estás seguro de eliminar este artículo?"
          />

   
        </div>


        
      )}
      
    </DashboardLayout>
  );
};

export default HistorialBajas;