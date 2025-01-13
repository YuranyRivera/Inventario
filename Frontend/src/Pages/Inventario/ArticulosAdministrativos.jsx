import React, { useState } from 'react';
import AdminArticlesTable from '../../Components/AdminArticlesTable';
import CategorySelect from '../../Components/CategorySelect';
import DateInput from '../../Components/DateInput';
import { Search } from 'lucide-react';
import ButtonGroup from '../../Components/PDF';
import ExcelExportButton from '../../Components/Excel';
import ModalConfirmacion from '../../Components/ModalConf';

const ArticulosAdministrativos = ({ articulos = [], reloadArticulos }) => {
  const headers = ['ID', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Precio'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articuloToDelete, setArticuloToDelete] = useState(null);

  // Define handleCancel function
  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedRowData({});
  };

  // Filter articles based on search term, category, and dates
  const filteredArticulos = articulos.filter(articulo => {
    const matchesSearch = 
      (articulo.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (articulo.proveedor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (articulo.ubicacion || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || articulo.categoria === selectedCategory;
    
    const articuloDate = articulo.fecha ? new Date(articulo.fecha) : null;
    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;
    
    const matchesDate = 
      (!fromDateObj || !articuloDate || articuloDate >= fromDateObj) &&
      (!toDateObj || !articuloDate || articuloDate <= toDateObj);

    return matchesSearch && matchesCategory && matchesDate;
  });

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
    if (field === 'id') {
      return;
    }
    
    setEditedRowData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditedRowData({ 
      ...row,
      fecha: row.fecha ? row.fecha.split('T')[0] : '', // Asegurarse de que la fecha esté en formato YYYY-MM-DD
    });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...editedRowData,
        precio: parseFloat(editedRowData.precio) || 0,
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
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned unexpected content type. Status: ${response.status} ${response.statusText}`);
      }
  
      if (!response.ok) {
        // Check for HTML response if not JSON
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

  // Prepare table rows with null checks and proper formatting
  const tableRows = filteredArticulos.map(articulo => ({
    id: articulo.id || '',
    fecha: articulo.fecha ? new Date(articulo.fecha).toISOString().split('T')[0] : '',
    descripcion: articulo.descripcion || '',
    proveedor: articulo.proveedor || '',
    ubicacion: articulo.ubicacion || '',
    observacion: articulo.observacion || '',
    precio: typeof articulo.precio === 'number' ? articulo.precio.toFixed(2) : '0.00'
  }));

  return (
   
   <div className="space-y-4">
      {/* Modal de confirmación */}
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

      <div className="overflow-x-auto">
        <AdminArticlesTable
          headers={headers}
          rows={tableRows}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
          editingRowIndex={editingRowIndex}
          editedRowData={editedRowData}
          handleInputChange={(e, field) => setEditedRowData({ ...editedRowData, [field]: e.target.value })}
          handleSave={handleSave}
          handleCancel={handleCancel}
          disableFields={['id']}
        />
      </div>
    </div>
  );
};

export default ArticulosAdministrativos;
