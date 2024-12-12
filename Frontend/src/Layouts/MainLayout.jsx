import React from 'react';
import Sidebar from '../Components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
