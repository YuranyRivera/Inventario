import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../Components/InputField';
import SelectRole from '../../Components/SelectRole';
import BotonPrincipal from '../../Components/Boton';
import Table from '../../Components/TableUsuarios';
import axios from 'axios';
import ModalConfirmacion from '../../Components/ModalConfirmacion';

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
  const [message, setMessage] = useState('');  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errores de validación
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  useEffect(() => {
    fetchContactos();
  }, []);

  const fetchContactos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/usuarios');
      setContactos(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
      console.log('Usuario eliminado:', response.data);
      fetchContactos(); 
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
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
    if (!formData.fullName) newErrors.fullName = 'El nombre completo es obligatorio.';
    if (!formData.email) newErrors.email = 'El correo es obligatorio.';
    if (formData.password !== formData.confirmPassword) newErrors.password = 'Las contraseñas no coinciden.';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
    if (!formData.role) newErrors.role = 'Por favor selecciona un rol.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validate()) return;

    const nuevoContacto = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    axios.post('http://localhost:4000/api/usuarios', nuevoContacto)
      .then(response => {
        fetchContactos(); 
        setMessage('Usuario guardado exitosamente!');  
        setIsConfirmModalOpen(true);  
      })
      .catch(error => {
        console.error('Error al crear el usuario:', error);
        setMessage('Hubo un error al guardar el usuario.');  
        setIsConfirmModalOpen(true);  
      });

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
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
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <div className="w-full max-w-3xl p-12 shadow-md rounded-lg overflow-hidden">
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
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        message={message} 
      />
      
      {/* Modal para ver contactos */}
      <div className="absolute top-6 right-6">
        <BotonPrincipal Text="Ver Contactos" onClick={toggleModal} />
      </div>

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
              onDelete={eliminarUsuario} 
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Contactos;
