import React, { useState } from 'react';
import AdminArticlesTable from '../../Components/AdminArticlesTable';
import CategorySelect from '../../Components/CategorySelect';
import DateInput from '../../Components/DateInput';

const ArticulosAdministrativos = () => {
  const headers = ['ID', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación'];
  const rows = [
    ['1', '2024-11-22', 'Descripción 1', 'Proveedor 1', 'Oficina', 'Ninguna'],
    ['2', '2024-11-23', 'Descripción 2', 'Proveedor 2', 'Almacén', 'Ninguna'],
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleEdit = (row) => console.log('Editar', row);
  const handleDelete = (row) => console.log('Eliminar', row);

  return (
    <div>
      {/* Fila con el menú desplegable y las fechas */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/4">
          <label className="block text-lg mb-2">Categoría</label>
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
        <DateInput
          label="Fecha Desde"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <DateInput
          label="Fecha Hasta"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        
      </div>
  
      
      {/* Tabla con acciones */}
      <div className="overflow-x-auto">
        <AdminArticlesTable
          headers={headers}
          rows={rows}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      </div>
  );
};

export default ArticulosAdministrativos;
