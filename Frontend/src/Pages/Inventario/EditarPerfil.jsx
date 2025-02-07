import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import InputField from '../../Components/InputField';
import Boton from '../../Components/Boton';
import { useUser } from '../../Context/UserContext';
import ModalConfirmacion from '../../Components/ModalConfirmacion';
import '@dotlottie/player-component';
const EditarPerfil = () => {
  const { user, updateUser } = useUser(); 
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Set initial form data
    setFormData(prevData => ({
      ...prevData,
      fullName: user?.nombre || '',
      email: user?.correo || ''
    }));

    return () => clearTimeout(timer);
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: user?.nombre || '',
    email: user?.correo || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });



  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpiar errores al escribir
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

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
  const validate = () => {
    const newErrors = {};
  
    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'El nombre completo debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'El nombre completo solo puede contener letras y espacios';
    }
  
    // Validar correo
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    } else if (formData.email.length > 100) {
      newErrors.email = 'El correo electrónico es demasiado largo';
    }
  
    // Validar contraseña actual
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es obligatoria';
    } else if (formData.currentPassword.length < 8) {
      newErrors.currentPassword = 'La contraseña actual debe tener al menos 8 caracteres';
    }
  
    // Validaciones para nueva contraseña y confirmación
    if (formData.newPassword || formData.confirmPassword) {
      // Validaciones para nueva contraseña
      if (!formData.newPassword.trim()) {
        newErrors.newPassword = 'La nueva contraseña es obligatoria si deseas cambiarla';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
      } else if (formData.newPassword === formData.currentPassword) {
        newErrors.newPassword = 'La nueva contraseña no puede ser igual a la contraseña actual';
      } else {
        // Validaciones adicionales de complejidad de contraseña
        const hasUppercase = /[A-Z]/.test(formData.newPassword);
        const hasLowercase = /[a-z]/.test(formData.newPassword);
        const hasNumber = /[0-9]/.test(formData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
  
        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
          newErrors.newPassword = 'La nueva contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
        }
      }
  
      // Validaciones para confirmar contraseña
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Debes confirmar tu nueva contraseña';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
  
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetch('https://inventarioschool-v1.onrender.com/api/update-profile', {
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
  
      if (response.ok) {
        // Actualizar el contexto
        updateUser({
          nombre: formData.fullName,
          correo: formData.email
        });
        
        setModalOpen(true);
        
        // Solo limpiar los campos de contraseña
        setFormData(prevData => ({
          ...prevData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
  
        setErrors({});
        setMessage(null);
  
        setTimeout(() => {
          setModalOpen(false);
        }, 2000);
      } else {
        if (result.error === 'Contraseña actual incorrecta') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            currentPassword: 'La contraseña actual es incorrecta',
          }));
        } else {
          setMessage(result.error || 'Error al actualizar el perfil');
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMessage('Error interno del servidor');
    }
  };
  return (
    <DashboardLayout>
    {/* Loader */}
    {isLoading && (
      <div className="flex justify-center items-center h-screen">
        <dotlottie-player
          src="https://lottie.host/0aca447b-d3c9-46ed-beeb-d4481815915a/qvvqgKAKQU.lottie"
          background="transparent"
          speed="1"
          style={{ width: '300px', height: '300px' }}
          loop
          autoplay
        />
      </div>
    )}

    {/* Content */}
    {!isLoading && (
      <div className="justify-center items-center flex flex-col h-full pt-[3em] ">
        <div className="w-full max-w-lg p-8 shadow-md  overflow-hidden rounded-lg">
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Editar Perfil</h1>
          {message && <p className="text-center text-red-500 mb-4">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* Nombre Completo */}
            <InputField
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

            {/* Correo */}
            <InputField
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            {/* Contraseña Actual */}
          {/* Contraseña Actual */}
<div className="relative">
  <InputField
    label="Contraseña Actual"
    type={showPassword.currentPassword ? 'text' : 'password'}
    name="currentPassword"
    value={formData.currentPassword}
    onChange={handleChange}
    placeholder="Ingresa tu contraseña actual"
  />
  <button 
    type="button"
    onClick={() => handlePasswordToggle('currentPassword')}
    className="absolute top-[70%] right-2 transform -translate-y-1/2 text-gray-500"
    aria-label={showPassword.currentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    <i className={`bx ${showPassword.currentPassword ? 'bx-show' : 'bx-hide'} cursor-pointer`}></i>
  </button>
</div>
{errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}

{/* Nueva Contraseña */}
<div className="relative">
  <InputField
    label="Nueva Contraseña"
    type={showPassword.newPassword ? 'text' : 'password'}
    name="newPassword"
    value={formData.newPassword}
    onChange={handleChange}
    placeholder="Ingresa tu nueva contraseña"
  />
  <button
    type="button"
    onClick={() => handlePasswordToggle('newPassword')}
    className="absolute top-[70%]  right-2 transform -translate-y-1/2 text-gray-500"
    aria-label={showPassword.newPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    <i className={`bx ${showPassword.newPassword ? 'bx-show' : 'bx-hide'} cursor-pointer`}></i>
  </button>
</div>
{errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}

{/* Confirmar Contraseña */}
<div className="relative">
  <InputField
    label="Confirmar Nueva Contraseña"
    type={showPassword.confirmPassword ? 'text' : 'password'}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Confirma tu nueva contraseña"
  />
  <button
    type="button"
    onClick={() => handlePasswordToggle('confirmPassword')}
    className="absolute top-[70%] right-2 transform -translate-y-1/2 text-gray-500"
    aria-label={showPassword.confirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    <i className={`bx ${showPassword.confirmPassword ? 'bx-show' : 'bx-hide'} cursor-pointer`}></i>
  </button>
</div>
{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}


            <div className="flex justify-center mt-6">
              <Boton type="submit" Text="Actualizar" />
            </div>
          </form>
        </div>
      </div>
         )}

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message="Perfil actualizado exitosamente"
      />
    </DashboardLayout>
  );
};

export default EditarPerfil;