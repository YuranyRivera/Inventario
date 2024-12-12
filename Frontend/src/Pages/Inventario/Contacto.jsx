import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../Components/InputField';
import SelectRole from '../../Components/SelectRole';
import BotonPrincipal from '../../Components/Boton';
import Table from '../../Components/TableUsuarios';
import axios from 'axios';

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

  // Función para cargar los contactos
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

  // Función para eliminar un usuario
  const eliminarUsuario = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
      console.log('Usuario eliminado:', response.data);
      fetchContactos(); // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!formData.role) {
      alert('Por favor selecciona un rol.');
      return;
    }

    if (!formData.fullName) {
      alert('El nombre completo es obligatorio.');
      return;
    }

    const nuevoContacto = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    axios.post('http://localhost:4000/api/usuarios', nuevoContacto)
      .then(response => {
        fetchContactos(); // Recargar la lista de contactos
      })
      .catch(error => {
        console.error('Error al crear el usuario:', error);
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

  return (
    <MainLayout>
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <div className="w-full max-w-3xl p-12 shadow-md rounded-lg overflow-hidden">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Agregar Nuevo Usuario</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>

            <div className="mt-6">
              <SelectRole
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-center mt-6">
              <BotonPrincipal type="submit" Text="Guardar" />
            </div>
          </form>
        </div>
      </div>

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
              onDelete={eliminarUsuario} // Pasa la función eliminarUsuario como prop
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Contactos;
