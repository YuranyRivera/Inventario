import React, { useState } from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';
import { Search } from 'lucide-react';
import ButtonGroup from '../../Components/PDF';
import ExcelExportButton from '../../Components/Excel'; // Importar el componente de Excel

const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  const headers = ['ID', 'Producto/Detalle',  'Cantidad Inicial',  'Módulo', 'Estante', 'Estado', 'Entrada', 'Salida', 'Restante'];
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  
  // Función para filtrar artículos basado en el término de búsqueda
  const filteredArticulos = articulos.filter(articulo =>
    articulo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.estante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejador para el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Actualiza el estado cuando se edita un campo
  const handleInputChange = (e, field) => {
    const value = e.target.value;
     // Ignorar cambios en campos no editables
    if (field === 'id' || field === 'cantidad') {
      return;
    }
  
    setEditedRowData((prev) => {
      const updatedData = {
        ...prev,
        [field]: value,
      };
  
      // Recalcular el restante solo si los campos entrada o salida cambian
      if (field === 'entrada' || field === 'salida') {
        const entrada = parseInt(updatedData.entrada || 0, 10);
        const salida = parseInt(updatedData.salida || 0, 10);
        const cantidadInicial = parseInt(prev.cantidad_productos || 0, 10);
  
        updatedData.cantidad = cantidadInicial + entrada - salida;
      }
  
      return updatedData;
    });
  };

  // Maneja la edición de una fila
  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditedRowData({ ...row });
  };

  // Guardar la fila editada
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/articulos/${editedRowData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRowData), // Envía los datos editados
      });

      if (!response.ok) {
        throw new Error('Error al editar el artículo');
      }

      const updatedArticulo = await response.json();
      reloadArticulos(); // Recargar los artículos después de la edición
      setEditingRowIndex(null); // Finalizar la edición
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  // Cancelar la edición
  const handleCancel = () => {
    setEditingRowIndex(null);
  };

  // Maneja la eliminación de una fila
  const handleDelete = async (row) => {
    const id = row.id; // Usamos el ID directamente

    try {
      const response = await fetch(`http://localhost:4000/api/articulos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      const result = await response.json();
      console.log(result.message);
      reloadArticulos(); // Recargar los artículos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Buscador con botón */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <button
            onClick={() => console.log('Búsqueda realizada:', searchTerm)}
            className="px-4 py-2 bg-[#00A305] text-white rounded-lg hover:bg-[#00A305] focus:outline-none focus:ring-2 focus:blue-600 focus:ring-offset-2"
          >
            Buscar
          </button>
        </div>

        {/* Botones de PDF y Excel */}
        <div className="flex space-x-4">
          <ButtonGroup
            isStorageSelected={true}
            reloadArticulos={reloadArticulos}
            filteredData={searchTerm ? filteredArticulos : []}
            allData={articulos}
          />
          <ExcelExportButton 
            filteredData={searchTerm ? filteredArticulos : []} 
            allData={articulos} 
          />
        </div>

        {/* Tabla */}
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
          onDelete={handleDelete}
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
    </>
  );
};

export default ArticulosAlmacenamiento;
