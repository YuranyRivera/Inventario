// useHistorialBajas.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHistorialBajas = (createImageButton, createPDFButton) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('bajas2');
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);

  const headers = ['ID', 'Artículo', 'Motivo de Baja', 'Fecha de Baja', 'Usuario', 'Imagen', 'Exportar'];

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch data from API
  const fetchHistorialBajas = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await fetch('http://localhost:4000/api/articulos-baja-historial');
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
        createImageButton(item.imagen_baja, () => setSelectedImage(item.imagen_baja)),
        createPDFButton([
          item.id,
          item.producto,
          item.motivo_baja,
          formatDate(item.fecha_baja),
          item.usuario_baja,
          item.imagen_baja
        ])
      ]);
      setRows(mappedRows);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setIsLoading(false);
    }
  };

  // Handle navigation
  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    
    const routes = {
      general: '/registro',
      traslados: '/moduloadmin',
      bajas: '/articulosbaja',
      bajas2: '/articulosbaja2'
    };

    if (routes[value]) {
      navigate(routes[value]);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (row) => {
    setSelectedRowToDelete(row);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    const id = selectedRowToDelete[0];
    try {
      const response = await fetch(`http://localhost:4000/api/articulos_baja_historial/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      setTimeout(async () => {
        await fetchHistorialBajas();
        setIsLoading(false);
      }, 1000);
      
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
      setIsLoading(false);
    }
  };

  // Filter rows based on search term and dates
  const filteredRows = rows.filter((row) => {
    const searchFields = [
      row[1] || '', // Artículo
      row[2] || '', // Motivo
      row[4] || '', // Usuario
    ];
    
    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  // Load initial data
  useEffect(() => {
    fetchHistorialBajas();
  }, []);

  return {
    isLoading,
    selectedOption,
    headers,
    filteredRows,
    searchTerm,
    fromDate,
    toDate,
    selectedImage,
    showDeleteConfirmation,
    setSearchTerm,
    setFromDate,
    setToDate,
    setSelectedImage,
    handleOptionChange,
    handleDeleteClick,
    handleConfirmDelete,
    setShowDeleteConfirmation,
    fetchHistorialBajas
  };
};