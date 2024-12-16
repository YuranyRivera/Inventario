import React, { useState } from 'react';
import Input from '../../Components/Input';
import Boton from '../../Components/Boton';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [globalError, setGlobalError] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const { loginUser } = useUser(); // Destructure loginUser from context
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Muy importante
        body: JSON.stringify({ correo, contraseña: contrasena }),
      });
  
      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Login result:', result);
        
        loginUser(result.user, result.token);
        navigate('/Dashboard');
      } else {
        const errorResult = await response.json();
        console.error('Login error:', errorResult);
        setGlobalError(errorResult.error || 'Error de inicio de sesión');
      }
    } catch (error) {
      console.error('Login network error:', error);
      setGlobalError('Error de conexión');
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

            {/* Enlace de Olvidar Contraseña */}
            <div className="mt-4 text-center">
            <Link to="/OlvidarContraseña" className="text-blue-500 hover:underline">
  ¿Olvidaste tu contraseña?
</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
