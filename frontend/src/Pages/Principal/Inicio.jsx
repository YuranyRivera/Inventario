import React from 'react';

const Login = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <img 
        src="/Img/colegio.png" // Aquí se usa la ruta relativa desde public
        alt="Imagen del colegio" 
        className="w-full h-full object-cover" 
      />
       <div className="absolute inset-0 bg-black opacity-10"></div> 

      <div className="absolute w-[90%] h-[90%] top-[5%] left-2/4 transform -translate-x-1/2 bg-white bg-opacity-70 p-10 rounded-lg flex">
        {/* Columna izquierda (título y eslogan) */}
        <div className="w-1/2 flex flex-col justify-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center">Bienvenido al Sistema</h2>
          <p className="text-lg text-gray-600 text-center">Accede con tus credenciales para continuar</p>
        </div>

        {/* Columna derecha (formulario de login) */}
        <div className="w-1/2 flex justify-center items-center">
          <form className="space-y-4 w-full max-w-sm">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Usuario</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">Iniciar sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
