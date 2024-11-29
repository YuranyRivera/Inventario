import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex  flex-col w-64 h-screen bg-[#00A305] text-white p-4">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img
          src="/Img/logo.png"  // Cambia esto con la ruta de tu logo
          alt="Logo del Colegio"
          className="h-12 w-12 mr-2"
        />
        <span className="text-2xl font-semibold">Inventario</span>
      </div>

      {/* Enlaces del menú */}
      <div className="flex flex-col space-y-4">
        <a href="/Dashboard" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-chart-line mr-3"></i> Tablero
        </a>
        <a href="/Articulos" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-box mr-3"></i> Artículo
        </a>
        <a href="/Contacto" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-address-book mr-3"></i> Contacto
        </a>
        <a href="/Entrada" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-file-alt mr-3"></i> Registro
        </a>
 
        <a href="/EditarPerfil" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-user-edit mr-3"></i> Editar perfil
        </a>
      </div>

      {/* Opción de salir */}
      <div className="mt-auto flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
        <i className="fas fa-sign-out-alt mr-3"></i> Salir
      </div>
    </div>
  );
};

export default Sidebar;
