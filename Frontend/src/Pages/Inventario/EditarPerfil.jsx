import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../Components/InputField';
import Boton from '../../Components/Boton';
import { useUser } from '../../Context/UserContext';

const EditarPerfil = () => {
  const { user } = useUser(); // Obtener el usuario autenticado del contexto
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  const [formData, setFormData] = useState({
    fullName: user?.nombre || '', // Prellenar con los datos del usuario
    email: user?.correo || '',
    currentPassword: '', // Campo obligatorio
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que las contraseñas coincidan
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
  
    console.log('Enviando formulario con los siguientes datos:', formData);
    console.log('Token de autorización:', token); // Aquí ya está el token desde localStorage
  
    try {
      const response = await fetch('http://localhost:4000/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined,
          nombre: formData.fullName || undefined,
          correo: formData.email || undefined,
        }),
      });
  
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
  
      if (response.ok) {
        setMessage('Perfil actualizado exitosamente');
        console.log('Usuario actualizado:', result.user);
      } else {
        setMessage(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMessage('Error interno del servidor');
    }
  };
  return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-lg p-8 bg-gray-100 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Editar Perfil</h1>
          {message && <p className="text-center text-red-500 mb-4">{message}</p>}
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
              label="Contraseña Actual"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña actual"
              required
            />
            <InputField
              label="Nueva Contraseña"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Ingresa tu nueva contraseña"
            />
            <InputField
              label="Confirmar Nueva Contraseña"
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
