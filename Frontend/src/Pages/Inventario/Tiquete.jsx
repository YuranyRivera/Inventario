import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import TableWithActions from '../../Components/TableWithActions';
import DashboardLayout from '../../layouts/DashboardLayout';
const Example = () => {
    const navigate = useNavigate(); // Hook para la navegación
  const headers = ['Numeri', 'Fecha', 'Ultima actualizacion', 'Canttidad', ];
  const rows = [
    ['1', 'Producto A', '2024-11-25', 'Activo'],
    ['2', 'Producto B', '2024-11-24', 'Inactivo'],
  ];


  const customActions = (row) => (
    <button
      onClick={() => navigate('/TiqueteInd')} // Redirige a la ruta deseada
      className="bg-[#00A305] text-white py-1 px-3 rounded flex items-center hover:bg-green-700 transition-colors"
    >
      <i className="fas fa-file-alt mr-2"></i> Informe
    </button>
  );



  return (
    <DashboardLayout>
        <div className="mb-6 m-5">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Tiquete-Central</h1>

    <TableWithActions
      title="Tabla de Ejemplo"
      headers={headers}
      rows={rows}
      customActions={customActions} // Pasar el botón personalizado
    />
      </div>
    </DashboardLayout>
  );
};

export default Example;
