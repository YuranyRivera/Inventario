import React from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';

const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  const headers = ['ID', 'Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Entrada', 'Salida', 'Restante'];

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
          articulo.modulo,
          articulo.estante,
          articulo.cantidad,
          articulo.producto,
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
