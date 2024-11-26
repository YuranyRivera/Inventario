import React from 'react';
import TableWithActions from '../../Components/TableWithActions';

const ArticulosAlmacenamiento = () => {
  const headers = ['Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Entrada', 'Salida', 'Restante', 'Acciones'];
  const rows = [
    ['Módulo 1', 'Estante 3', '10', 'Producto A', 'Bueno', '5', '2', '3'],
  ];

  const handleEdit = (row) => console.log('Editar', row);
  const handleDelete = (row) => console.log('Eliminar', row);

  return (
    <TableWithActions 
      title="Artículos de Almacenamiento"
      headers={headers}
      rows={rows}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ArticulosAlmacenamiento;
