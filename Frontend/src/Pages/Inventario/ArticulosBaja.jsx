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
import Select from 'react-select';


const Example = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('bajas');
  const headers = ['ID', 'Código', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Precio'];
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
          formatPrice(item.precio),
        ]);
        setRows(mappedRows);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchArticulosBaja();
  }, []);

  const handleDelete = async (row) => {
    const id = row[0];
    try {
      const response = await fetch(`http://localhost:4000/api/articulos_baja/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      setRows((prevRows) => prevRows.filter((item) => item[0] !== id));
      alert(`Artículo con ID ${id} eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
      alert('Hubo un error al intentar eliminar el artículo.');
    }
  };

  const handleEdit = (row) => {
    console.log('Editar', row);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Artículos Dados de Baja', 20, 10);
    doc.autoTable({
      head: [headers],
      body: filteredRows, // Use filtered rows for export
    });
    doc.save('articulos_dados_de_baja.pdf');
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
    }
  };
  return (
    <DashboardLayout>
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
            <span className="text-gray-700">Dados de baja</span>
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
            onDelete={handleDelete}
          />
        </div>
   

    </DashboardLayout>
  );
};

export default Example;