import React, { useState } from 'react';
import Input from '../../Components/Input';
import Boton from '../../Components/Boton';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <form className="space-y-4 w-full max-w-sm justify-center items-center">
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
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
              />
              <i
                className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer fas ${
                  showPassword ? 'fa-eye-slash' : 'fa-eye'
                }`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <div className="flex justify-center">
              <Boton type="submit" Text="Iniciar sesión"></Boton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
