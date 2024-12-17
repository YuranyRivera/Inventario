import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext'; // Import useUser
import { Link } from 'react-router-dom'; // Importa el componente Link de react-router-dom

const Sidebar = () => {
  const navigate = useNavigate();
  const { logoutUser } = useUser(); // Use the logoutUser from context

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear server-side cookie
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include' // Important for sending cookies
      });
  
      // Clear local storage and context
      logoutUser();
      navigate('/Inicio');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-[#00A305] text-white p-4">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img
          src="/Img/logo.png"
          alt="Logo del Colegio"
          className="h-12 w-12 mr-2"
        />
        <span className="text-2xl font-semibold">Inventario</span>
      </div>
      {/* Enlaces del menú */}
      <div className="flex flex-col space-y-4">
        <Link to="/Dashboard" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-chart-line mr-3"></i> Tablero
        </Link>
        <Link to="/Articulos" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-box mr-3"></i> Artículo
        </Link>
        <Link to="/Contacto" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-address-book mr-3"></i> Contacto
        </Link>
        <Link to="/Registro" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
          <i className="fas fa-file-alt mr-3"></i> Registro
        </Link>
        <Link to="/EditarPerfil" className="flex items-center text-lg hover:bg-[#41B646] p-2 rounded">
  <i className="fas fa-user-edit mr-3"></i> Editar perfil
</Link>
      </div>
      {/* Opción de salir */}
      <div 
        onClick={handleLogout} 
        className="mt-auto flex items-center text-lg hover:bg-[#41B646] p-2 rounded cursor-pointer"
      >
        <i className="fas fa-sign-out-alt mr-3"></i> Salir
      </div>
    </div>
  );
};

export default Sidebar;
