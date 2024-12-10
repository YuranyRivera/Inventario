import React, { useState } from 'react';
import Input from '../../Components/Input';
import Boton from '../../Components/Boton';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [globalError, setGlobalError] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCorreoError('');
    setContrasenaError('');
    setGlobalError('');
  
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña: contrasena }), // Enviar correo y contraseña
      });
  
      const result = await response.json();
      console.log(result);  // Verifica qué se está recibiendo
  
      if (response.ok) {
        if (result.token && result.rol) {
          const userData = {
            id: result.id || null,
            nombre: result.nombre || 'Usuario',
            rol: result.rol,
          };
          setUser(userData);
  
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', result.token);
  
          setSuccessMessage('Inicio de sesión exitoso');
  
          setTimeout(() => {
            switch (result.rol) {
              case 1:
                navigate('/VistaAdmin');
                break;
              case 2:
                navigate('/Usuario/VistaUsuario');
                break;
              case 3:
                navigate('/SuperAdmin/dashboard');
                break;
              case 4:
                navigate('/Aprendiz/VistaAprendiz');
                break;
              default:
                setGlobalError('Rol de usuario desconocido');
                break;
            }
          }, 2000);
        } 
      } else {
        if (response.status === 401) {
          setGlobalError('Correo o contraseña incorrectos');
        } else {
          setGlobalError('Error en el servidor. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setGlobalError('Error en la conexión. Intenta nuevamente.');
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <img 
        src="/Img/colegio.png"
        alt="Imagen del colegio" 
        className="w-full h-full object-cover" 
      />

      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute w-[80%] h-[80%] top-[10%] left-2/4 transform -translate-x-1/2 bg-white bg-opacity-50 rounded-lg flex">
        <div className="w-1/2 flex flex-col justify-center space-y-4 p-20">
          <h2 className="font-serif text-[50px] break-words text-white font-montagu">
            ¡Trabajemos juntos!
          </h2>
          <p className="font-fans text-lg text-[30px] text-white font-bold">
            Para crear un ambiente positivo y colaborativo
          </p>
        </div>

        <div className="w-1/2 bg-white flex flex-col justify-center items-center">
          <div className="mb-10">
            <img 
              src="/Img/logo.png"
              alt="Imagen del colegio"
              className="w-32 h-auto"
            />
          </div>
          <form className="space-y-4 w-full max-w-sm justify-center items-center" onSubmit={handleSubmit}>
            <h2 className="text-center text-4xl font-josefin flex-auto">
              Iniciar Sesión
            </h2>
            <div>
              <Input
                type="email"
                id="username"
                name="username"
                className="w-full p-10 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu usuario"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {correoError && <span className="text-red-500">{correoError}</span>}
            </div>

            <div className="relative">
              <Input
                type={mostrarContrasena ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <i
                className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer fas ${
                  mostrarContrasena ? 'fa-eye-slash' : 'fa-eye'
                }`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            {globalError && <div className="text-red-500">{globalError}</div>}
            {successMessage && <div className="text-green-500">{successMessage}</div>}

            <div className="flex justify-center">
              <Boton type="submit" Text="Iniciar sesión" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
