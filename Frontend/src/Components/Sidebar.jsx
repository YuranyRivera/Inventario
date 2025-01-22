import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { Link } from 'react-router-dom';

const Sidebar = ({ onClose, isMobile }) => {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      logoutUser();
      navigate('/Inicio');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex flex-col w-64 h-full bg-[#00A305] text-white p-4 relative">
      {/* Close button only for mobile */}
      {isMobile && (
        <button 
          onClick={onClose} 
          className="md:hidden absolute top-4 right-4 text-white"
        >
          <i className="fas fa-times"></i>
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center mb-8">
        <img
          src="/Img/logo.png"
          alt="Logo del Colegio"
          className="h-12 w-12 mr-2"
        />
      <div className=''>
        <span className="text-2xl font-semibold ">Inventario</span>
            {/* Mostrar el nombre del usuario si está logueado */}
            {user && (
       <span className="flex">
          Hola, {user.nombre} {/* Asegúrate de que 'nombre' sea el campo correcto */}
        </ span >
      )}
      </div> 

      </div>

  
      {/* Menu Links */}
      <div className="flex flex-col space-y-4">
        <Link 
          to="/Dashboard" 
          className="flex items-center text-base md:text-lg hover:bg-[#41B646] p-2 rounded transition duration-300"
          onClick={isMobile ? onClose : undefined}
        >
          <i className="fas fa-chart-line mr-3"></i> Tablero
        </Link>
        <Link 
          to="/Articulos" 
          className="flex items-center text-base md:text-lg hover:bg-[#41B646] p-2 rounded transition duration-300"
          onClick={isMobile ? onClose : undefined}
        >
          <i className="fas fa-box mr-3"></i> Artículo
        </Link>
        <Link 
          to="/Contacto" 
          className="flex items-center text-base md:text-lg hover:bg-[#41B646] p-2 rounded transition duration-300"
          onClick={isMobile ? onClose : undefined}
        >
          <i className="fas fa-address-book mr-3"></i> Contacto
        </Link>
        <Link 
          to="/Registro" 
          className="flex items-center text-base md:text-lg hover:bg-[#41B646] p-2 rounded transition duration-300"
          onClick={isMobile ? onClose : undefined}
        >
          <i className="fas fa-file-alt mr-3"></i> Registro
        </Link>
        <Link 
          to="/EditarPerfil" 
          className="flex items-center text-base md:text-lg hover:bg-[#41B646] p-2 rounded transition duration-300"
          onClick={isMobile ? onClose : undefined}
        >
          <i className="fas fa-user-edit mr-3"></i> Editar perfil
        </Link>
      </div>

      {/* Logout Option */}
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
