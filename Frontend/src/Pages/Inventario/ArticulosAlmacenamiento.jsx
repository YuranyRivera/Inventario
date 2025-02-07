import React, { useState } from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';
import { Search } from 'lucide-react';
import ButtonGroup from '../../Components/PDFAlm';
import ExcelExportButton from '../../Components/Excel';
import ModalBaja from '../../Components/ModalBaja';
import { useNavigate } from 'react-router-dom'; 
const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  const headers = ['ID', 'Producto/Detalle', 'Cantidad Inicial', 'Módulo', 'Estante', 'Estado', 'Entrada', 'Salida', 'Restante'];
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const navigate = useNavigate(); // Hook para navegación
  const handleDeleteClick = (row) => {
    setSelectedArticulo(row);
    setIsModalOpen(true);
  };
  const handleDelete = async (formData) => {
    const id = selectedArticulo.id;
  
    try {
      const response = await fetch(`https://inventarioschool-v1.onrender.com/api/articulos-baja/${id}`, {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar el artículo');
      }
  
      console.log(result.message);
      if (result.imagen_url) {
        console.log('Imagen subida:', result.imagen_url);
      }
      reloadArticulos();
            // Navegar a la página ArticulosBaja.jsx
            navigate('/ArticulosBaja2'); // Cambia la ruta según tu configuración
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(error.message || 'Error al eliminar el artículo');
    }
  };

  const filteredArticulos = articulos.filter(articulo =>
    articulo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.estante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === 'id' || field === 'cantidad') {
      return;
    }
  
    setEditedRowData((prev) => {
      const updatedData = {
        ...prev,
        [field]: value,
      };
  
      if (field === 'entrada' || field === 'salida') {
        const entrada = parseInt(updatedData.entrada || 0, 10);
        const salida = parseInt(updatedData.salida || 0, 10);
        const cantidadInicial = parseInt(prev.cantidad_productos || 0, 10);
        updatedData.cantidad = cantidadInicial + entrada - salida;
      }
  
      return updatedData;
    });
  };

  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditedRowData({ ...row });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://inventarioschool-v1.onrender.com/api/articulos/${editedRowData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRowData),
      });

      if (!response.ok) {
        throw new Error('Error al editar el artículo');
      }

      await response.json();
      reloadArticulos();
      setEditingRowIndex(null);
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
  };

  return (
    <>
      <ModalBaja
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleDelete}
      />

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1 max-w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            <ButtonGroup
              isStorageSelected={true}
              reloadArticulos={reloadArticulos}
              filteredData={searchTerm ? filteredArticulos : []}
              allData={articulos}
              className="flex-grow md:flex-grow-0"
            />
            <ExcelExportButton 
              filteredData={searchTerm ? filteredArticulos : []} 
              allData={articulos}
              className="flex-grow md:flex-grow-0"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <AuxMaintenanceTable
            headers={headers}
            rows={filteredArticulos.map((articulo) => ({
              id: articulo.id,
              producto: articulo.producto,
              cantidad_productos: articulo.cantidad_productos,
              modulo: articulo.modulo,
              estante: articulo.estante,
              estado: articulo.estado,
              entrada: articulo.entrada,
              salida: articulo.salida,
              cantidad: articulo.cantidad,
            }))}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            editingRowIndex={editingRowIndex}
            editedRowData={editedRowData}
            handleInputChange={(e, field) => {
              if (['id', 'cantidad', 'cantidad_productos'].includes(field)) {
                e.preventDefault();
              } else {
                handleInputChange(e, field);
              }
            }}
            handleSave={handleSave}
            handleCancel={handleCancel}
            disableFields={['id', 'cantidad', 'cantidad_productos']}
          />
        </div>
      </div>
    </>
  );
};

export default ArticulosAlmacenamiento;