import React from 'react';
import TableEntrada from '../../Components/TableEntrada'
import DashboardLayout from '../../layouts/DashboardLayout';

const Example = () => {
  const headers = ['ID', 'Fecha de entrada', 'Cantidad de productos', 'Tipo de Registro', 'Estado'];
  const rows = [
    ['1', '2024-11-25', '3', 'Administrador',  'Activo'],
    ['2', '2024-11-24', '4', 'Almacenamiento', 'Inactivo'],
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Registro</h1>

        {/* Tabla personalizada */}
        <TableEntrada headers={headers} rows={rows} />
      </div>
    </DashboardLayout>
  );
};

export default Example;
