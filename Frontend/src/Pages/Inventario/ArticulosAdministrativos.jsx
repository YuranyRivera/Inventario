import React, { useState } from 'react';
import TableWithActions from '../../Components/TableWithActions';
import CategorySelect from '../../Components/CategorySelect';
import DateInput from '../../Components/DateInput';

const ArticulosAdministrativos = () => {
  const headers = ['ID', 'Item', 'Fecha', 'Descripción', 'Ubicación', 'Estado', 'Acciones'];
  const rows = [
    [ '1',  'Artículo 1', '2024-11-22', 'Descripción', 'Oficina', 'Disponible'],
    [ '2', 'Artículo 2', '2024-11-23', 'Descripción', 'Almacén', 'No Disponible'],
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
        <CategorySelect 
          selectedCategory={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
        />
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
      <TableWithActions 
        title="Artículos Administrativos"
        headers={headers}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ArticulosAdministrativos;
