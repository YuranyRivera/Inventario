import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../Layouts/DashboardLayout';

import BotonPrincipal from '../../Components/Boton';
import BotonSecundario from '../../Components/BotonSecundario';

const AuxMantenimiento = () => {
  const navigate = useNavigate();
  const headers = ['Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Acciones'];
  const initialRows = [['Módulo 1', 'Estante 1', 10, 'Producto A', 'Disponible', 5, 3, 2]];

  const handleSave = (rows) => {
    console.log('Artículos guardados:', rows);
    // Lógica para guardar en la base de datos
  };

  const handleDevolver = () => {
    navigate('/articulos', { state: { selected: 'almacenamiento' } });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>
        <h2 className="text-xl font-semibold text-center text-black mb-4">Artículos de Aux Mantenimiento</h2>
        <TableWithAddRow headers={headers} initialRows={initialRows} onSave={handleSave} />
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <BotonSecundario Text="Devolver" onClick={handleDevolver} />
        <BotonPrincipal Text="Guardar" onClick={() => handleSave(initialRows)} />
      </div>
    </DashboardLayout>
  );
};

export default AuxMantenimiento;
