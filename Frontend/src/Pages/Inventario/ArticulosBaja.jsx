import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Search } from 'lucide-react';
import DateInput from '../../Components/DateInput';
import CategorySelect from '../../Components/CategorySelect';
import DashboardLayout from '../../layouts/DashboardLayout';
import TablaArt from '../../Components/TablaArt';
import BotonPrincipal from '../../Components/Boton';
import ModalConfirmacion from '../../Components/ModalConf';
import Select from 'react-select';
import '@dotlottie/player-component';


const Example = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para abrir o cerrar el modal
const [articuloToDelete, setArticuloToDelete] = useState(null);
  const [selectedOption, setSelectedOption] = useState('bajas');
  const headers = ['ID', 'Código', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación'];
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationInitial, setSelectedLocationInitial] = useState('');

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const ubicaciones = [
    { value: 'Recepción', label: 'Recepción' },
    { value: 'Tesorería', label: 'Tesorería' },
    { value: 'Coordinación convivencia', label: 'Coordinación convivencia' },
    { value: 'Rectoría', label: 'Rectoría' },
    { value: 'Secretaría académica', label: 'Secretaría académica' },
    { value: 'Coordinación académica', label: 'Coordinación académica' },
    { value: 'Sala de profesores', label: 'Sala de profesores' },
    { value: 'Aux contable y financiera', label: 'Aux contable y financiera' },
    { value: 'Aux administrativa y contable', label: 'Aux administrativa y contable' },
    { value: 'Contadora', label: 'Contadora' },
    { value: 'Cocina', label: 'Cocina' },
    { value: 'Almacén', label: 'Almacén' },
    { value: 'Espacio de servicios generales', label: 'Espacio de servicios generales' },
    { value: 'Sala audiovisuales', label: 'Sala audiovisuales' },
    { value: 'Sala lúdica', label: 'Sala lúdica' },
    { value: 'Capilla', label: 'Capilla' },
  ];


  const filteredRows = rows.filter((row) => {
    // Search term filtering
    const searchFields = [
      row[3] || '', // Descripción (index 3)
      row[4] || '', // Proveedor (index 4)
      row[5] || '', // Ubicación (index 5)
      row[6] || ''  // Observación (index 6)
    ];
    
    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Location filtering
    const matchesLocationInitial = !selectedLocationInitial || 
      row[5]?.toString().toLowerCase() === selectedLocationInitial.value.toLowerCase();


    // Date filtering
    let rowDate = row[2] ? new Date(row[2].split('/').reverse().join('-')) : null;
    let fromDateObj = fromDate ? new Date(fromDate) : null;
    let toDateObj = toDate ? new Date(toDate) : null;

    if (rowDate) rowDate.setHours(0, 0, 0, 0);
    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(0, 0, 0, 0);

    const matchesFromDate = !fromDateObj || (rowDate && rowDate >= fromDateObj);
    const matchesToDate = !toDateObj || (rowDate && rowDate <= toDateObj);

    return matchesSearch && 
           matchesLocationInitial && 
       
           matchesFromDate && 
           matchesToDate;
  });

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format price as Colombian currency
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Obtener datos desde la API
  useEffect(() => {
    
    const fetchArticulosBaja = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const response = await fetch('http://localhost:4000/api/articulos_baja');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        const mappedRows = data.map((item) => [
          item.id,
          item.codigo,
          formatDate(item.fecha_baja),
          item.descripcion,
          item.proveedor,
          item.ubicacion,
          item.observacion,
       
        ]);
        setRows(mappedRows);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      
      }
    };

    fetchArticulosBaja();
  }, []);

  const handleDelete = async (row) => {
    setIsLoading(true); // Mostrar el loader antes de eliminar

    const id = row[0];
    try {
      // Eliminar el artículo
      const response = await fetch(`http://localhost:4000/api/articulos_baja/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      // Filtrar el artículo eliminado de la lista
      setRows((prevRows) => prevRows.filter((item) => item[0] !== id));

      // Recargar los artículos después de eliminar uno
      setTimeout(async () => {
        const response = await fetch('http://localhost:4000/api/articulos_baja');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        const mappedRows = data.map((item) => [
          item.id,
          item.codigo,
          formatDate(item.fecha_baja),
          item.descripcion,
          item.proveedor,
          item.ubicacion,
          item.observacion,
        ]);
        setRows(mappedRows);
        setIsLoading(false); // Ocultar el loader después de recargar
      }, 1000); // Recargar después de 1 segundo (ajusta este tiempo si lo deseas)
    } catch (error) {
      console.error('Error al eliminar:', error);
      setIsLoading(false); // Ocultar el loader si ocurre un error
    }
  };

  

  const handleEdit = (row) => {
    console.log('Editar', row);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const columns = [
      { header: 'ID', dataKey: 0 },
      { header: 'Código', dataKey: 1 },
      { header: 'Fecha', dataKey: 2 },
      { header: 'Descripción', dataKey: 3 },
      { header: 'Proveedor', dataKey: 4 },
      { header: 'Ubicación', dataKey: 5 },
      { header: 'Observación', dataKey: 6 },
    ];
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
      doc.text('Reporte de articulos dados de baja', doc.internal.pageSize.width / 2, titleY, { align: 'center' });

 
        // Tabla de datos
        doc.autoTable({
          startY: titleY + 15,
          head: [columns.map((col) => col.header)], // Títulos de las columnas
          body: rows.map((row) => columns.map((col) => row[col.dataKey])), // Datos de las filas
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
     
    doc.save('articulos_dados_de_baja.pdf');
  };

};

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...filteredRows]); // Use filtered rows for export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Artículos');
    XLSX.writeFile(workbook, 'articulos_dados_de_baja.xlsx');
  };

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

  const handleDeleteClick = (row) => {
    setArticuloToDelete(row); // Guardamos el artículo que se quiere eliminar
    setIsModalOpen(true); // Abrimos el modal de confirmación
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
      <>
        <ModalConfirmacion
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            if (articuloToDelete) {
              handleDelete(articuloToDelete);
            }
            setIsModalOpen(false);
          }}
          message="¿Está seguro de que desea dar de baja este artículo?"
        />
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-10">
          Artículos Dados de Baja
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
   <span className="text-gray-700">Historial de bajas-Almacenamiento </span>
  </label>
        </div>
    
    

        <div className="space-y-4">
  {/* Search and export buttons in one line */}
  <div className="flex items-center gap-2">
    {/* Search bar */}
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Buscar por descripción, proveedor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Export buttons */}
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

            {/* Filters grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación 
                </label>
                <Select
                  options={ubicaciones}
                  value={selectedLocationInitial}
                  onChange={setSelectedLocationInitial}
                  isClearable
                  placeholder="Seleccionar ubicación..."
                  className="text-sm"
                />
              </div>


            
     
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
  title="Artículos Administrativos"
  headers={headers}
  rows={filteredRows}
  onEdit={handleEdit}
  onDelete={handleDeleteClick} // Actualiza la función de eliminar
/>
        </div>
        </>
        )}
    </DashboardLayout>
  );
};


export default Example;