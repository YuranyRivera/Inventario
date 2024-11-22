// AgregarArticulo.jsx
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';  // Layout envolvente
import TableWithAddRow from '../../Components/TableWithAddRow';  // Componente que maneja filas con entrada editable

const AgregarArticulo = () => {
  const headers = ['Item', 'Fecha', 'Descripción', 'Ubicación', 'Estado', 'Acciones'];
  const initialRows = [
    ['Articulo 1', '2024-11-22', 'Descripción del artículo', 'Almacén Principal', 'Disponible'],
  ];

  const handleSave = (rows) => {
    console.log("Artículos guardados:", rows);
    // Aquí puedes procesar los datos guardados o enviarlos a la API
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>

        {/* Subtítulo */}
        <h2 className="text-xl font-semibold text-center text-black mb-4">Artículos Administrativos</h2>

        {/* Tabla con la opción de agregar filas */}
        <TableWithAddRow headers={headers} initialRows={initialRows} onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
};

export default AgregarArticulo;
