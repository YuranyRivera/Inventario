import React from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';

const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  // Actualizar el orden de los encabezados
  const headers = ['ID', 'Producto/Detalle', 'Cantidad', 'Módulo', 'Estante', 'Estado', 'Entrada', 'Salida', 'Restante'];

  const handleEdit = (row) => {
    console.log('Editar', row);
  };

  const handleDelete = (row) => {
    console.log('Eliminar', row);
  };

  return (
    <>
      <AuxMaintenanceTable
        headers={headers}
        rows={articulos.map((articulo) => [
          articulo.id,
          articulo.producto, // Producto/Detalle primero
          articulo.cantidad, // Luego cantidad
          articulo.modulo,   // Luego módulo
          articulo.estante,  // Luego estante
          articulo.estado, 
          articulo.entrada,
          articulo.salida,
          articulo.restante,
        ])}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ArticulosAlmacenamiento;
