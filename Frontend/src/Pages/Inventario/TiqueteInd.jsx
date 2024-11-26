import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar el hook para navegación
import TableWithActions from '../../Components/TableWithActions';
import DashboardLayout from '../../layouts/DashboardLayout';
import BotonPrincipal from '../../Components/Boton';
import BotonSecundario from '../../Components/BotonSecundario';

const Example = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación
  const headers = ['Fecha', 'Descripcion', 'Ultima actualizacion', 'Cantidad', 'Acciones'];
  const rows = [
    ['1', 'Producto A', '2024-11-25', 'Activo'],
    ['2', 'Producto B', '2024-11-24', 'Inactivo'],
  ];

  const handleEdit = (row) => console.log('Editar', row);
  const handleDelete = (row) => console.log('Eliminar', row);

  // Manejar la acción de guardar
  const handleSave = (data) => {
    console.log('Guardado:', data);
    // Aquí puedes implementar la lógica de guardado
  };

  // Manejar la acción de devolver
  const handleDevolver = () => {
    navigate('/tiquete'); // Ruta hacia la interfaz Tiquete.jsx
  };

  const CustomButtonGroup = () => (
    <div className="flex space-x-4 justify-end mb-4">
      <button className="bg-[#00A305] text-white py-2 px-4 rounded">
        <i className="fas fa-file-excel mr-2"></i> Excel
      </button>
      <button className="bg-white text-green-600 py-2 px-4 border-2 border-green-600 rounded">
        <i className="fas fa-file-pdf mr-2"></i> PDF
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Tiquete-Central</h1>
        <CustomButtonGroup />
        <TableWithActions 
          title="Artículos Administrativos"
          headers={headers}
          rows={rows}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Botones Guardar y Devolver */}
        <div className="flex justify-end mt-6 space-x-4">
          <BotonSecundario Text="Devolver" onClick={handleDevolver} />
          <BotonPrincipal Text="Guardar" onClick={() => handleSave(rows)} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Example;
