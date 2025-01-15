import React, { useState } from 'react';
import AdminArticlesTable from '../../Components/AdminArticlesTable';
import CategorySelect from '../../Components/CategorySelect';
import DateInput from '../../Components/DateInput';
import { Search } from 'lucide-react';
import ButtonGroup from '../../Components/PDF';
import ExcelExportButton from '../../Components/Excel';
import ModalConfirmacion from '../../Components/ModalConf';

// Función para formatear números a moneda colombiana
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Función para convertir el formato de moneda a número
const currencyToNumber = (value) => {
  if (!value) return 0;
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
};

const ArticulosAdministrativos = ({ articulos = [], reloadArticulos }) => {
  const headers = ['ID', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Precio'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articuloToDelete, setArticuloToDelete] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedRowData({});
    setErrors([]);
  };

  const validateRow = (row, index) => {
    const rowErrors = {};
    if (!row.descripcion || row.descripcion.trim() === '') {
      rowErrors.descripcion = 'La descripción es requerida';
    }
    if (!row.precio) {
      rowErrors.precio = 'El precio es requerido';
    }
    return rowErrors;
  };

  const validateRows = () => {
    if (!editedRowData) return false;
    const rowErrors = validateRow(editedRowData);
    setErrors(rowErrors);
    return Object.keys(rowErrors).length === 0;
  };

  const filteredArticulos = articulos.filter(articulo => {
    const matchesSearch = 
      (articulo.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (articulo.proveedor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (articulo.ubicacion || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !selectedLocation || articulo.ubicacion === selectedLocation;
    
    if (!fromDate && !toDate) return matchesSearch && matchesLocation;
    
    const fechaArticuloStr = articulo.fecha ? articulo.fecha.split('T')[0] : '';
    const [year, month, day] = fechaArticuloStr.split('-').map(num => parseInt(num, 10));
    const fechaArticulo = new Date(Date.UTC(year, month - 1, day));
    
    let fechaInicio = null;
    let fechaFin = null;
    
    if (fromDate) {
      const [startYear, startMonth, startDay] = fromDate.split('-').map(num => parseInt(num, 10));
      fechaInicio = new Date(Date.UTC(startYear, startMonth - 1, startDay));
    }
    
    if (toDate) {
      const [endYear, endMonth, endDay] = toDate.split('-').map(num => parseInt(num, 10));
      fechaFin = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999));
    }

    const cumpleFechaInicio = !fechaInicio || fechaArticulo >= fechaInicio;
    const cumpleFechaFin = !fechaFin || fechaArticulo <= fechaFin;
    
    return matchesSearch && matchesLocation && cumpleFechaInicio && cumpleFechaFin;
  });

  const tableRows = filteredArticulos.map(articulo => ({
    id: articulo.id || '',
    fecha: articulo.fecha ? new Date(articulo.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : '',
    descripcion: articulo.descripcion || '',
    proveedor: articulo.proveedor || '',
    ubicacion: articulo.ubicacion || '',
    observacion: articulo.observacion || '',
    precio: formatCurrency(articulo.precio) // Formatear precio a moneda colombiana
  }));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteModal = (row) => {
    setArticuloToDelete(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setArticuloToDelete(null);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === 'id') return;
    
    // Si el campo es precio, formatear como moneda
    const processedValue = field === 'precio' ? 
      formatCurrency(value.replace(/[^\d]/g, '')) : 
      value;

    setEditedRowData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditedRowData({ 
      ...row,
      fecha: row.fecha ? row.fecha.split('T')[0] : '',
      precio: formatCurrency(row.precio) // Asegurar que el precio esté formateado
    });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateRows()) {
      return;
    }

    try {
      const dataToSend = {
        ...editedRowData,
        precio: currencyToNumber(editedRowData.precio), // Convertir el precio a número
        fecha: editedRowData.fecha || new Date().toISOString().split('T')[0]
      };
  
      const response = await fetch(`http://localhost:4000/api/articulos_administrativos/${editedRowData.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Server error: Please check the backend for issues.');
        }
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'Error al editar el artículo administrativo');
      }
  
      await response.json();
      reloadArticulos();
      setEditingRowIndex(null);
      setEditedRowData({});
      setErrors({});
    } catch (error) {
      console.error('Error al editar:', error);
      alert('Error al editar el artículo: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!articuloToDelete) return;
    try {
      const response = await fetch(`http://localhost:4000/api/articulos_administrativos/${articuloToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Server error: Please check the backend for issues.');
        }
        const errorData = JSON.parse(text);
        throw new Error(`Error: ${errorData.message || 'No se pudo eliminar el artículo.'}`);
      }

      await response.json();
      reloadArticulos();
      setIsModalOpen(false);
      setArticuloToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el artículo: ' + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <ModalConfirmacion
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message="¿Está seguro de que desea eliminar este artículo?"
      />

      <div className="flex flex-col md:flex-row items-stretch space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por descripción, proveedor..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <ButtonGroup
            isStorageSelected={false}
            reloadArticulos={reloadArticulos}
            filteredData={searchTerm ? tableRows : []}
            allData={articulos}
            className="flex-grow md:flex-grow-0"
          />
          <ExcelExportButton 
            filteredData={searchTerm ? tableRows : []} 
            allData={articulos}
            className="flex-grow md:flex-grow-0"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-1/4">
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
          <CategorySelect
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">Desde</label>
          <DateInput
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">Hasta</label>
          <DateInput
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <AdminArticlesTable
          headers={headers}
          rows={tableRows}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
          editingRowIndex={editingRowIndex}
          editedRowData={editedRowData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
          errors={errors}
          disableFields={['id']}
        />
      </div>
    </div>
  );
};

export default ArticulosAdministrativos;