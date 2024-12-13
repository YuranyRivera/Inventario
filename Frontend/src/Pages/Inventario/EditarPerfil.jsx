import React, { useState } from 'react';
import DashboardLayout from '../../layouts/MainLayout';
import InputField from '../../Components/InputField';
import Boton from '../../Components/Boton';
import { useUser } from '../../Context/UserContext';

const EditarPerfil = () => {
  const { user } = useUser(); 
  const token = localStorage.getItem('token'); 
  const [formData, setFormData] = useState({
    fullName: user?.nombre || '',
    email: user?.correo || '',
    currentPassword: '', 
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordToggle = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
  
    console.log('Enviando formulario con los siguientes datos:', formData);
    console.log('Token de autorización:', token);
  
    try {
      const response = await fetch('http://localhost:4000/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
        <div className="w-full max-w-lg p-8  shadow-md rounded-lg">
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
            <div className="relative">
              <InputField
                label="Contraseña Actual"
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
                required
              />
              <span 
                onClick={() => handlePasswordToggle('currentPassword')} 
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500">
                <i className={`bx ${showPassword.currentPassword ? 'bx-show' : 'bx-hide'} cursor-pointer mt-[30px] text-[20px]`}></i>
              </span>
            </div>
            <div className="relative">
              <InputField
                label="Nueva Contraseña"
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Ingresa tu nueva contraseña"
              />
              <span 
                onClick={() => handlePasswordToggle('newPassword')} 
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500">
                <i className={`bx ${showPassword.newPassword ? 'bx-show' : 'bx-hide'} cursor-pointer mt-[30px] text-[20px]`}></i>
              </span>
            </div>
            <div className="relative">
              <InputField
                label="Confirmar Nueva Contraseña"
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu nueva contraseña"
              />
              <span 
                onClick={() => handlePasswordToggle('confirmPassword')} 
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500">
                <i className={`bx ${showPassword.confirmPassword ? 'bx-show' : 'bx-hide'} cursor-pointer mt-[30px] text-[20px]`}></i>
              </span>
            </div>
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
