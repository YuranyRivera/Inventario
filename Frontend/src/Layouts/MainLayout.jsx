
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      {/* Mobile Control Button */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-[#00A305] p-2 rounded-md"
        >
          <i className="fas fa-bars text-white"></i>
        </button>
      )}
      
      {/* Sidebar */}
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-0 overflow-auto">
        <div className="h-full p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
