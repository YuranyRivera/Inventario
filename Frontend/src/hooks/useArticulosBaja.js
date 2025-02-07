import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const useArticulosBaja = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articuloToDelete, setArticuloToDelete] = useState(null);
  const [selectedOption, setSelectedOption] = useState('bajas');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredRows = rows.filter((row) => {
    const searchFields = [
      row[3] || '', // Descripción
      row[4] || '', // Proveedor
      row[5] || '', // Ubicación
      row[6] || ''  // Observación
    ];

    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesLocationInitial = !selectedLocationInitial || 
      row[5]?.toString().toLowerCase() === selectedLocationInitial.value.toLowerCase();

    let rowDate = row[2] ? new Date(row[2].split('/').reverse().join('-')) : null;
    let fromDateObj = fromDate ? new Date(fromDate) : null;
    let toDateObj = toDate ? new Date(toDate) : null;

    if (rowDate) rowDate.setHours(0, 0, 0, 0);
    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(0, 0, 0, 0);

    const matchesFromDate = !fromDateObj || (rowDate && rowDate >= fromDateObj);
    const matchesToDate = !toDateObj || (rowDate && rowDate <= toDateObj);

    return matchesSearch && matchesLocationInitial && matchesFromDate && matchesToDate;
  });

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
    setIsLoading(true);
    const id = row[0];
    try {
      const response = await fetch(`http://localhost:4000/api/articulos_baja/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      setRows((prevRows) => prevRows.filter((item) => item[0] !== id));

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
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setIsLoading(false);
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
      const imgWidth = 190;
      const imgHeight = (img.height * imgWidth) / img.width;
      const x = (doc.internal.pageSize.width - imgWidth) / 2;
      const y = 10;

      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);

      const titleY = y + imgHeight + 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de artículos dados de baja', doc.internal.pageSize.width / 2, titleY, { align: 'center' });

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

      doc.save('articulos_dados_de_baja.pdf');
    };
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...filteredRows]);
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
      default:
        break;
    }
  };

  const handleDeleteClick = (row) => {
    setArticuloToDelete(row);
    setIsModalOpen(true);
  };

  return {
    isLoading,
    isModalOpen,
    articuloToDelete,
    selectedOption,
    rows,
    searchTerm,
    selectedLocationInitial,
    fromDate,
    toDate,
    ubicaciones,
    filteredRows,
    setSearchTerm,
    setSelectedLocationInitial,
    setFromDate,
    setToDate,
    handleDelete,
    handleEdit,
    exportToPDF,
    exportToExcel,
    handleOptionChange,
    handleDeleteClick,
    setIsModalOpen,
  };
};

export default useArticulosBaja;