import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';  // Layout envolvente
import Table from '../../Components/Table';  // Componente reutilizable para tablas

const Dashboard = () => {
  // Encabezados de las tablas sin filas de datos

  const resumenHeaders = ['Artículos Totales', 'Artículos Administrativos', 'Artículos Aux. Mantenimiento'];
  const actividadHeaders = ['Fecha y Hora', 'Cantidad', 'Ubicación'];

  return (
    <DashboardLayout>
      <div className="mb-6">
        {/* Título Tablero Central */}
        <h1 className="text-3xl font-bold text-center text-black mt-20">Tablero </h1>

        {/* Tabla Resumen de Inventario */}
        <Table title="Resumen de Inventario" headers={resumenHeaders} rows={[]} />
      </div>
      
      <div className="mt-6">
        {/* Tabla Actividad Reciente */}
        <Table title="Actividad Reciente" headers={actividadHeaders} rows={[]} />
      </div>

      {/* Aquí podrían ir los gráficos (como los gráficos circulares o de barras) */}
      <div className="mt-6">
        {/* Espacio para los gráficos */}
        <div className="flex justify-between">
          <div className="w-1/2">
            {/* Gráfico 1 (Círculo) */}
            <div className="bg-gray-300 h-64 rounded-lg">Gráfico Circular</div>
          </div>
          <div className="w-1/2">
            {/* Gráfico 2 (Barras o cualquier otro tipo de gráfico) */}
            <div className="bg-gray-300 h-64 rounded-lg">Gráfico de Barras</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
