import React from 'react';
import Input from '../../Components/Input';
import Boton from '../../Components/Boton'
const Login = () => {
  return (
    <div className="h-screen w-full overflow-hidden relative">
      <img 
        src="/Img/colegio.png" // Aquí se usa la ruta relativa desde public
        alt="Imagen del colegio" 
        className="w-full h-full object-cover" 
      />

       <div className="absolute inset-0 bg-black opacity-10"></div> 
        {/* fondo negro */}
      <div className="absolute w-[80%] h-[80%] top-[10%] left-2/4 transform -translate-x-1/2 bg-white bg-opacity-50  rounded-lg flex">
        {/* Columna izquierda (título y eslogan) */}
        <div className="w-1/2 flex flex-col justify-center space-y-4 p-20">
          <h2 className="font-serif text-[50px] break-words   text-white  font-montagu">¡Trabajemos juntos!
</h2>
          <p className="font-fans text-lg text-[30px] text-white font-bold">Para crear un ambiente positivo y colaborativo </p>
        </div>

        {/* Columna derecha (formulario de login) */}
        <div className="w-1/2  bg-white flex flex-col justify-center  items-center">
     <div className=" mb-10 "> 
    <img 
      src="/Img/logo.png" // Aquí se usa la ruta relativa desde public
      alt="Imagen del colegio" 
      className="w-32 h-auto" // Ajusta el tamaño del logo si es necesario
    />
  </div>
          <form className="  space-y-4 w-full max-w-sm justify-center  items-center">
            <h2 className=' text-center text-4xl font-josefin flex-auto '>Iniciar Sesion</h2>
            <div>
           
              <Input 
                type="text" 
           
                id="username" 
                name="username" 
                className="w-full p-10 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
          
              <Input 
                type="password" 
                id="password" 
                name="password" 
                className="w-full  mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="flex justify-center">
              <Boton type="submit" Text=" Iniciar sesión"></Boton>
            </div>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default Login;
