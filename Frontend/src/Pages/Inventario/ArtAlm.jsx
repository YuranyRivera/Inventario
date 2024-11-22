// Articulos.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';  // Layout envolvente
import CheckboxGroup from '../../Components/CheckboxGroup'; // Componente para los checkboxes
import ButtonGroup from '../../Components/ButtonGroup';     // Componente para los botones

import TableWithActions from '../../Components/TableWithActions'; 

const Articulos = () => {
  const [selected, setSelected] = useState({
    administrativos: false,
    almacenamiento: false,
  });
  const handleCheckboxChange = (e, category) => {
    setSelected({
      administrativos: category === 'administrativos',
      almacenamiento: category === 'almacenamiento',
    });
  };


  const handleActionClick = () => {
    if (selected.almacenamiento) {
      console.log('Redirigir a realizar tiquete');
    } else {
      console.log('Filtrar tabla');
    }
  };

  const headers = ['Item', 'Fecha', 'Descripción', 'Ubicación', 'Estado', 'Acciones'];
  const rows = [
    ['Articulo 1', '2024-11-22', 'Descripción del artículo', 'Almacén Principal', 'Disponible', ],
  ];

  const handleEdit = (row) => {
    console.log("Editar", row);
  };

  const handleDelete = (row) => {
    console.log("Eliminar", row);
  };


  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>

   <div className='flex justify-between  '> 
        <CheckboxGroup onChange={handleCheckboxChange} />

        <ButtonGroup
            isStorageSelected={selected.almacenamiento}
            onActionClick={handleActionClick}
          />
        </div>
        {/* Tabla */}
        <TableWithActions title="Lista de Artículos" headers={headers} rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
     
      </div>
    </DashboardLayout>
  );
};

export default Articulos;
