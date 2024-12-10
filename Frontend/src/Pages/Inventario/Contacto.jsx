import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../Components/InputField';
import Boton from '../../Components/Boton';
import Table from '../../Components/Table';  // Importa el componente Table

const Contactos = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [contactos, setContactos] = useState([]);  // Estado para almacenar los contactos

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const nuevoContacto = {
      fullName: formData.fullName,
      email: formData.email,
    };

    // Agrega el nuevo contacto al estado de contactos
    setContactos([...contactos, nuevoContacto]);

    // Limpia los campos del formulario
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col p-8">
        {/* Título central */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Agregar Nuevo Usuario</h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre Completo"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            className="border-b"
          />
          <InputField
            label="Correo"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo"
            className="border-b"
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            className="border-b"
          />
          <InputField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirma tu contraseña"
            className="border-b"
          />
          <div className="flex justify-center">
            <Boton type="submit" Text="Guardar" />
          </div>
        </form>

        {/* Tabla de contactos */}
        <Table 
          title="Lista de Contactos" 
          headers={['Nombre Completo', 'Correo']} 
          rows={contactos} // Pasa los contactos al componente Table
        />
      </div>
    </DashboardLayout>
  );
};

export default Contactos;
