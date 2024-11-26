import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import TableWithAddRow from '../../Components/TableWithAddRow';
import BotonPrincipal from '../../Components/Boton';
import BotonSecundario from '../../Components/BotonSecundario';

const Administrativos = () => {
  const navigate = useNavigate();
  const headers = ['Item', 'Fecha', 'Descripción', 'Ubicación', 'Estado', 'Acciones'];
  const initialRows = [['Articulo 1', '2024-11-22', 'Descripción del artículo', 'Almacén Principal', 'Disponible']];

  const handleSave = (rows) => {
    console.log('Artículos guardados:', rows);
    // Lógica para guardar en la base de datos
  };

  const handleDevolver = () => {
    navigate('/articulos', { state: { selected: 'administrativos' } });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>
        <h2 className="text-xl font-semibold text-center text-black mb-4">Artículos Administrativos</h2>
        <TableWithAddRow headers={headers} initialRows={initialRows} onSave={handleSave} />
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <BotonSecundario Text="Devolver" onClick={handleDevolver} />
        <BotonPrincipal Text="Guardar" onClick={() => handleSave(initialRows)} />
      </div>
    </DashboardLayout>
  );
};

export default Administrativos;
