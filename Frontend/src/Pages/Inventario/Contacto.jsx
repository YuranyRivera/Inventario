import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../Components/InputField';  // Asegúrate de importar InputField
import Boton from '../../Components/Boton';

const Contactos = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    // Aquí puedes manejar el envío, como hacer una petición a tu API
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-screen ">
        <div className="w-full max-w-lg p-8 bg-gray-100 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Agregar Nuevo Usuario</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
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
              placeholder="Ingresa tu contraseña"
            />
            <InputField
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
            />
            <div className="flex justify-center">
              <Boton type="submit" Text="Guardar" />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contactos;
