import React from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';


const ArticulosAlmacenamiento = () => {
  const headers = ['ID',  'Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Entrada', 'Salida', 'Restante', ];
  const rows = [
    [ '1', 'Módulo 1', 'Estante 3', '10', 'Producto A', 'Bueno', '5', '2', '3'],
  ];

  const handleEdit = (row) => console.log('Editar', row);
  const handleDelete = (row) => console.log('Eliminar', row);

  return (
    <AuxMaintenanceTable 
    headers={headers}
    rows={rows}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
  );
};

export default ArticulosAlmacenamiento;
