import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../Components/InputField'; // Importar correctamente el componente InputField
import Boton from '../../Components/Boton';
const EditarPerfil = () => {
  // Inicializa los datos de estado como vacíos para permitir que el usuario los escriba
  const [formData, setFormData] = useState({
    fullName: '', // Vacío para que el usuario pueda escribir
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;  // Destructuración para obtener 'name' y 'value'
    console.log(`Campo: ${name}, Valor: ${value}`);  // Diagnóstico, muestra el valor que se está actualizando
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Actualiza el estado con el valor del input específico
    }));
  };

  // Envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del perfil actualizados:', formData); // Diagnóstico, muestra los datos al enviar
    // Aquí puedes manejar el envío, como hacer una petición a tu API
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-screen ">
        <div className="w-full max-w-lg p-8 bg-gray-100 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Editar Perfil</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              label="Nombre Completo"
              type="text"
              name="fullName"  // Asegúrate de usar 'name' para que coincida con el estado
              value={formData.fullName}
              onChange={handleChange}  // Usa el manejador de cambios
              placeholder="Ingresa tu nombre completo"
            />
            <InputField
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
            />
            <InputField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu nueva contraseña"
            />
            <InputField
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu nueva contraseña"
            />
               <div className="flex justify-center">
              <Boton type="submit" Text="Actualizar" />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditarPerfil;
