import React from 'react';
import Sidebar from '../Components/Sidebar'; // Componente del menú lateral

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex ">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 overflow-y-auto h-screen">
        {/* Contenido principal */}
        <div className="p-4 flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
