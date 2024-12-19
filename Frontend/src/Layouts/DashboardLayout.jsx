import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
<div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Mobile Control Button */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-[#00A305] p-2 rounded-md"
        >
          <i className="fas fa-bars text-white"></i>
        </button>
      )}

      {/* Sidebar for mobile and desktop */}
      <div className={`
        fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 z-50 md:z-auto
      `}>
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
          isMobile={isSidebarOpen}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto md:h-screen pt-16 md:pt-0">
        <div className="p-4 max-w-full">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;