import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Input from '../../Components/Input';
import Boton from '../../Components/Boton';

const ActualizarContrasena = () => {
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [token, setToken] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    // Extraer parámetros de la URL
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const token = params.get('token');
  
    if (email && token) {
      setCorreo(email);
      setToken(token);
    }
  
    console.log(email, token); // Verifica que los valores sean correctos
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validación de contraseñas
    if (contrasena !== confirmarContrasena) {
      setContrasenaError('Las contraseñas no coinciden');
      return;
    }
  
    if (!contrasena || !confirmarContrasena) {
      setContrasenaError('La contraseña es obligatoria');
      return;
    }
  
    setContrasenaError(''); // Limpiar errores
  
    setLoading(true);
  
    try {
      const requestBody = { token, email: correo, newPassword: contrasena };
      console.log('Sending request body:', requestBody);
  
      const response = await fetch('http://localhost:4000/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Muestra mensaje de éxito
      } else {
        setGlobalError(data.error); // Muestra mensaje de error
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setGlobalError('Hubo un error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <img src="/Img/colegio.png" alt="Imagen del colegio" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute w-[80%] h-[80%] top-[10%] left-2/4 transform -translate-x-1/2 bg-white bg-opacity-50 rounded-lg flex">
        <div className="w-1/2 flex flex-col justify-center space-y-4 p-20">
          <h2 className="font-serif text-[50px] break-words text-white font-montagu">¡Actualiza tu Contraseña!</h2>
          <p className="font-fans text-lg text-[30px] text-white font-bold">Ingresa tu nueva contraseña</p>
        </div>

        <div className="w-1/2 bg-white flex flex-col justify-center items-center">
          <div className="mb-10">
            <img src="/Img/logo.png" alt="Imagen del colegio" className="w-32 h-auto" />
          </div>
          <form className="space-y-4 w-full max-w-sm justify-center items-center" onSubmit={handleSubmit}>
            <h2 className="text-center text-4xl font-josefin flex-auto">Actualizar Contraseña</h2>
            <div>
              <Input
                type="password"
                id="contrasena"
                name="contrasena"
                className="w-full p-10 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu nueva contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              {contrasenaError && <span className="text-red-500">{contrasenaError}</span>}
            </div>

            <div>
              <Input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                className="w-full p-10 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirma tu nueva contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />
            </div>

            {globalError && <div className="text-red-500">{globalError}</div>}

            <div className="flex justify-center">
              <Boton type="submit" Text={loading ? 'Cargando...' : 'Actualizar Contraseña'} disabled={loading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActualizarContrasena;
