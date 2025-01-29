import React, { useState } from 'react';

const ModalBaja = ({ isOpen, onClose, onSave, articleData }) => {
  const [formData, setFormData] = useState({
    motivo_baja: '',
    usuario_baja: '',
    imagen: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        imagen: file
      }));
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (formData.motivo_baja.trim() === '' || formData.usuario_baja.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Crear FormData para enviar la imagen
    const sendData = new FormData();
    sendData.append('motivo_baja', formData.motivo_baja);
    sendData.append('usuario_baja', formData.usuario_baja);
    if (formData.imagen) {
      sendData.append('imagen', formData.imagen);
    }

    onSave(sendData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
        <h2 className="text-xl text-gray-700 text-center mb-4">Registro de Baja de Artículo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Lado izquierdo: Detalles y carga de imagen */}
          <div className="space-y-4">
            {/* Previsualización de imagen */}
            <div className="aspect-square w-full relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-image text-4xl"></i>
                </div>
              )}
            </div>

            {/* Input de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del artículo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            {/* Detalles del artículo */}
            {articleData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Detalles del Artículo</h3>
                <p className="text-sm text-gray-600">ID: {articleData.id}</p>
                <p className="text-sm text-gray-600">Nombre: {articleData.nombre}</p>
                <p className="text-sm text-gray-600">Cantidad: {articleData.cantidad}</p>
              </div>
            )}
          </div>

          {/* Lado derecho: Formulario */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Baja
              </label>
              <textarea
                name="motivo_baja"
                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe el motivo de la baja..."
                value={formData.motivo_baja}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario que realiza la baja
              </label>
              <input
                type="text"
                name="usuario_baja"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nombre del usuario"
                value={formData.usuario_baja}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-white hover:bg-[#00A305] text-green-600 rounded-lg border-2 border-green-600 px-4 py-2 hover:text-white transition duration-300 flex items-center"
            onClick={handleSave}
          >
            <i className="fas fa-check-circle mr-2"></i>
            Registrar Baja
          </button>

          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center"
            onClick={onClose}
          >
            <i className="fas fa-times-circle mr-2"></i>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalBaja;