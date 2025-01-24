import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import InputField from '../../Components/InputField';
import SelectRole from '../../Components/SelectRole';
import BotonPrincipal from '../../Components/Boton';
import Table from '../../Components/TableUsuarios';
import axios from 'axios';
import ModalConfirmacion from '../../Components/ModalConfirmacion';
import ModalError from '../../Components/ModalError';  // Asegúrate de que la ruta sea correcta
import '@dotlottie/player-component';
import ModalConf from '../../Components/ModalConf';
const Contactos = () => {

const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
});
const [contactos, setContactos] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);  
const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);  
const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
const [message, setMessage] = useState('');  
const [errorMessage, setErrorMessage] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isContentReady, setIsContentReady] = useState(false);
const [errors, setErrors] = useState({
    
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContactos();
      setIsContentReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const fetchContactos = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:4000/api/usuarios');
      setContactos(response.data);

      // Reset errors when fetching contacts
      setErrors({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setUserToDelete(id);
    setIsDeleteConfirmModalOpen(true);
  };

  const eliminarUsuario = async () => {
    if (!userToDelete) return;

    setIsDeleteConfirmModalOpen(false);
    setIsModalOpen(false);
    setIsLoading(true);
    
    try {
      await axios.delete(`http://localhost:4000/api/usuarios/${userToDelete}`);
      await fetchContactos();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setErrorMessage('No se pudo eliminar el usuario');
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setUserToDelete(null);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Limpiar todos los errores cuando el usuario empieza a escribir
    setErrors({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
  
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    // Nombre completo validaciones
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'El nombre solo puede contener letras.';
    }
  
    // Email validaciones
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }
  
    // Contraseña validaciones
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales.';
    }
  
    // Confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
  
    // Rol validación
    if (!formData.role) {
      newErrors.role = 'Por favor selecciona un rol.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const nuevoContacto = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      await axios.post('http://localhost:4000/api/usuarios', nuevoContacto);
      fetchContactos();
      setMessage('Usuario guardado exitosamente!');
      setIsConfirmModalOpen(true);
      setTimeout(() => setIsConfirmModalOpen(false), 2000);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
    } catch (error) {
      let errorMsg = 'Hubo un error al guardar el usuario.';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            if (error.response.data.error.includes('correo')) {
              errorMsg = 'El correo electrónico ya está registrado.';
            }
            break;
          case 409:
            errorMsg = 'Ya existe un usuario con este correo electrónico.';
            break;
          case 500:
            errorMsg = 'Error interno del servidor. Por favor, intente nuevamente.';
            break;
          default:
            errorMsg = error.response.data.error || 'Hubo un error inesperado.';
        }
      }
      setErrorMessage(errorMsg);
      setIsErrorModalOpen(true);
      setTimeout(() => setIsErrorModalOpen(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <MainLayout>

<ModalConf 
  isOpen={isDeleteConfirmModalOpen}
  onClose={() => {
    setIsDeleteConfirmModalOpen(false);
    setUserToDelete(null);
  }}
  onConfirm={eliminarUsuario}
  message="¿Estás seguro de que deseas eliminar este usuario?"
  className="z-[50em]" // Add this line to ensure it appears on top
/>
       {isLoading && (
        <div className="flex justify-center items-center h-screen">
              <dotlottie-player
            src="https://lottie.host/0aca447b-d3c9-46ed-beeb-d4481815915a/qvvqgKAKQU.lottie"
            autoplay
            loop
            style={{ width: '300px', height: '300px' }}
          />
        </div>
      )}
            {isContentReady && (
      <div className="justify-center items-center flex flex-col h-full">
        
        <div className="w-full max-w-3xl p-12 shadow-md rounded-lg overflow-hidden  ">
          <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Agregar Nuevo Usuario</h1>

          <form onSubmit={handleSubmit} className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="w-full">
  <InputField
    label="Nombre Completo"
    type="text"
    name="fullName"
    value={formData.fullName}
    onChange={handleChange}
    placeholder="Ingresa tu nombre completo"
    className={`border-b ${errors.fullName ? 'border-red-500' : ''}`}
  />
  {errors.fullName && (
    <div className="text-red-500 mt-1 text-sm">
      {errors.fullName}
    </div>
  )}
</div>

<div className="mb-6 w-full">
  <InputField
    label="Correo"
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Ingresa tu correo"
    className={`border-b ${errors.email ? 'border-red-500' : ''}`}
  />
  {errors.email && (
    <div className="text-red-500 mt-1 text-sm">
      {errors.email}
    </div>
  )}
</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
  <div className="relative">
    <InputField
      label="Contraseña"
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Ingresa tu contraseña"
      className={`border-b ${errors.password ? 'border-red-500' : ''}`}
    />
    <button
      type="button"
      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
      onClick={togglePasswordVisibility}
    >
      <i className={`bx ${showPassword ? "bx-hide" : "bx-show"} cursor-pointer mt-[30px] text-[20px]`}></i>  
    </button>
    {errors.password && <p className="text-red-500 mt-2 text-sm">{errors.password}</p>}
  </div>

  <div className="relative">
    <InputField
      label="Confirmar Contraseña"
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirma tu contraseña"
      className={`border-b ${errors.password ? 'border-red-500' : ''}`}
    />
    <button
      type="button"
      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
      onClick={toggleConfirmPasswordVisibility}
    >
      <i className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"} cursor-pointer mt-[30px]  text-[20px]`}></i>
    </button>
  </div>
</div>

            <div className="mt-6">
              <SelectRole
                value={formData.role}
                onChange={handleChange}
                className={`border-b ${errors.role ? 'border-red-500' : ''}`}
              />
              {errors.role && <p className="text-red-500 mt-2  text-sm">{errors.role}</p>}
            </div>

            <div className="flex justify-center mt-6">
              <BotonPrincipal type="submit" Text="Guardar" />
                  {/* Modal para ver contactos */}
      <div className="absolute top-6 right-6">
        <BotonPrincipal Text="Ver Contactos" onClick={toggleModal} />
      </div>
            </div>
          </form>
        </div>
      </div>
      )}
      <ModalConfirmacion 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        message={message} 
      />
      
      {/* Modal de Error */}
      <ModalError 
  isOpen={isErrorModalOpen} 
  onClose={() => setIsErrorModalOpen(false)} 
  message={errorMessage} 
/>
      
  

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[80%] sm:w-[60%] p-6 max-h-screen overflow-hidden relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={toggleModal}
            >
              X
            </button>

            <Table
              title="Lista de Contactos"
              headers={['Nombre Completo', 'Correo', 'Rol']}
              rows={contactos}
              onDelete={handleDeleteConfirmation} 
              className="z-[10px]" 
            />
            
          </div>
        </div>
  
  )}
    </MainLayout>
  );
};

export default Contactos;